package io.apicurio.lifecycle.workflows.github;

public class GitHubClientAccessor {

    private static final GitHubClient client;
    static {
        client = new GitHubClient();
    }

    public static GitHubClient getClient() {
        return client;
    }
}
