package io.apicurio.lifecycle.workflows.github;

import java.net.URI;

import io.apicurio.common.apps.content.IoUtil;

public class GitHubClient {
    
    public ResourceCoordinates resolveResource(String resourceUrl) {
        return ResourceCoordinates.fromUrl(resourceUrl);
    }

    /**
     * Downloads the raw content of a resource identified by the given coordinates.
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
     * @param resourceCoordinates
     * @param newContent
     */
    public String createBranchAndPullRequest(ResourceCoordinates resourceCoordinates, String newContent) {
        // TBD
        return "12345"; // TODO return the ID of the new draft pull request
    }

    /**
     * Updates an existing branch 
     * @param branchName
     * @param resourceCoordinates
     * @param newContent
     */
    public void updateBranch(String branchName, ResourceCoordinates resourceCoordinates, String newContent) {
        // TBD
    }

    /**
     * Mark an existing pull request as Ready for Review.
     * @param pullRequestId
     * @param resourceCoordinates
     */
    public void markPullRequestReady(String pullRequestId, ResourceCoordinates resourceCoordinates) {
        // TBD
    }

}
