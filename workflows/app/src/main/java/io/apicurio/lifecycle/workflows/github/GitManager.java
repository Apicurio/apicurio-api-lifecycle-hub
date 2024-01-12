package io.apicurio.lifecycle.workflows.github;

import io.apicurio.lifecycle.workflows.AlwAppException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.kohsuke.github.GitHub;
import org.kohsuke.github.GitHubBuilder;

import java.io.IOException;

@ApplicationScoped
public class GitManager {

    @Inject
    GitConfigProperties properties;


    public GitRepo getRepo(String remoteStrURI) {
        return new GitRepo(properties, remoteStrURI); // TODO: Caching and cleanup.
    }


    public GitHub getGitHubClient() {
        try {
            return new GitHubBuilder()
                    .withPassword(properties.getGithubUser(), properties.getGithubToken())
                    .build();
        } catch (IOException ex) {
            throw new AlwAppException(ex);
        }
    }
}
