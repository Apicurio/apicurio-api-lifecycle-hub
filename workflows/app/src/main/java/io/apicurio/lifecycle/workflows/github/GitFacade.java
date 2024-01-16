package io.apicurio.lifecycle.workflows.github;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.workflows.AlwAppException;
import io.quarkus.arc.Unremovable;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.slf4j.Logger;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;

@Unremovable
@ApplicationScoped
public class GitFacade {

    @Inject
    Logger log;

    @Inject
    GitManager gitManager;

    @Inject
    GitConfigProperties properties;


    public ResourceCoordinates resolveResource(String resourceUrl) {
        return ResourceCoordinates.fromUrl(resourceUrl);
    }


    /**
     * Downloads the raw content of a resource identified by the given coordinates.
     *
     * @param ghCoordinates
     * @throws Exception
     */
    public String downloadResource(ResourceCoordinates ghCoordinates) throws Exception {
        URI uri = ghCoordinates.toURI();
        return IoUtil.toString(uri.toURL().openStream());
    }


    /**
     * Creates a new branch in the github repository for the resource identified by the coordinates.  Then it
     * adds the given content to that branch for the resource.  Finally opens a new Draft Pull Request for
     * the branch.
     */
    public void createBranchAndPullRequest(String apiId, String version, ResourceCoordinates coordinates, String newContent) {

        var remote = String.format("https://github.com/%s/%s.git", coordinates.getOrganization(), coordinates.getRepository());

        try (var repo = gitManager.getRepo(remote)) {

            repo.checkout(coordinates.getBranch(), coordinates.getGhPRBranch());

            var contentPath = repo.getRepoPath().resolve(coordinates.getPath());
            log.debug("Writing to content path '{}':\n{}", contentPath, newContent);
            Files.writeString(contentPath, newContent);

            if (!repo.hasChanged()) {
                log.info("Local schema version content is the same as in the remote branch. (The schema may have just been imported from the remote repository).");
                return;
            }

            repo.commit();
            repo.push();

            log.info("Creating a PR");

            var pr = gitManager.getGitHubClient()
                    .getRepository(coordinates.getOrganization() + "/" + coordinates.getRepository())
                    .createPullRequest(
                            "Update schema: " + coordinates.getPath(),
                            coordinates.getGhPRBranch(), coordinates.getBranch(), """
                                    Update schema `%s`, tracked as API ID `%s` and version `%s` in [Apicurio Lifecycle Hub](http://localhost:8888/apis/%s/versions/%s).
                                                                        
                                    This pull request will be updated automatically on version change.
                                    """.formatted(coordinates.getPath(), apiId, version, apiId, version),
                            true, true);

            coordinates.setGhPRId(pr.getId());
            coordinates.setGhPRNodeId(pr.getNodeId());
            coordinates.setGhPRWebURL(pr.getHtmlUrl().toString());

        } catch (IOException ex) {
            throw new AlwAppException(ex);
        }
    }


    /**
     * Updates an existing branch
     */
    public void updateBranch(ResourceCoordinates coordinates, String newContent) {

        var remote = String.format("https://github.com/%s/%s.git", coordinates.getOrganization(), coordinates.getRepository());

        try (var git = gitManager.getRepo(remote)) {

            git.checkout(coordinates.getGhPRBranch(), coordinates.getGhPRBranch());

            var contentPath = git.getRepoPath().resolve(coordinates.getPath());
            log.debug("Writing to content path '{}':\n{}", contentPath, newContent);
            Files.writeString(contentPath, newContent);

            if (!git.hasChanged()) {
                log.info("Local schema version content is the same as in the remote branch. (The schema may have just been imported from the remote repository).");
                return;
            }

            git.commit();
            git.push();

        } catch (IOException ex) {
            throw new AlwAppException(ex);
        }
    }


    /**
     * Mark an existing pull request as Ready for Review.
     */
    public void markPullRequestReady(ResourceCoordinates coordinates) {
        try {
            // TODO: Use full GraphQL client if needed.

            var body = """
                    {
                        "query": "mutation MarkPullRequestReadyForReview($pullRequestId: ID!) { \
                                    markPullRequestReadyForReview(input: { pullRequestId: $pullRequestId }) { \
                                      clientMutationId \
                                    } \
                                  } \
                                 ",
                        "variables": {
                          "pullRequestId": "%s"
                        }
                    }
                    """
                    .formatted(coordinates.getGhPRNodeId());

            var request = HttpRequest.newBuilder()
                    .uri(new URI("https://api.github.com/graphql"))
                    .headers("Content-Type", "application/json")
                    .headers("Authorization", "Bearer " + properties.getGithubToken())
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            var response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new AlwAppException("Could not mark PR as ready. Return code is %s and response:\n%s".formatted(response.statusCode(), response.body()));
            }

        } catch (URISyntaxException | IOException | InterruptedException ex) {
            throw new AlwAppException(ex);
        }
    }
}
