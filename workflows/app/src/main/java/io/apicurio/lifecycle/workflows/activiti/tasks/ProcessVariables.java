package io.apicurio.lifecycle.workflows.activiti.tasks;

public interface ProcessVariables {

    String API_ID = "apiId";
    String API_VERSION = "version";

    String GITHUB_ORG = Labels.GITHUB_ORG;
    String GITHUB_REPO = Labels.GITHUB_REPO;
    String GITHUB_BRANCH = Labels.GITHUB_BRANCH;
    String GITHUB_PATH = Labels.GITHUB_PATH;

    String GITHUB_PR_NODE_ID = "github:pr:nodeId";
}
