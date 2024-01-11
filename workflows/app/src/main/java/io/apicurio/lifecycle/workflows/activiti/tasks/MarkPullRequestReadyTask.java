package io.apicurio.lifecycle.workflows.activiti.tasks;

import org.activiti.engine.delegate.DelegateExecution;

import io.apicurio.lifecycle.workflows.github.GitHubClient;
import io.apicurio.lifecycle.workflows.github.GitHubClientAccessor;
import io.apicurio.lifecycle.workflows.github.ResourceCoordinates;

public class MarkPullRequestReadyTask extends AbstractTask {

    final private GitHubClient ghClient = GitHubClientAccessor.getClient();

    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String ghOrg = getProcessVariable(execution, "github:organization");
        String ghRepo = getProcessVariable(execution, "github:repository");
        String ghBranch = getProcessVariable(execution, "github:branch");
        String ghPath = getProcessVariable(execution, "github:path");
        String ghPullRequestId = getProcessVariable(execution, "github:pr:id");
        
        ResourceCoordinates ghResourceCoords = ResourceCoordinates.builder()
                .organization(ghOrg)
                .repository(ghRepo)
                .branch(ghBranch)
                .path(ghPath)
                .build();
        
        ghClient.markPullRequestReady(ghPullRequestId, ghResourceCoords);
    }

}
