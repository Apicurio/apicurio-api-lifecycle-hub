package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.workflows.github.GitHubClient;
import io.apicurio.lifecycle.workflows.github.GitHubClientAccessor;
import io.apicurio.lifecycle.workflows.github.ResourceCoordinates;

public class CreateOrUpdateDraftPullRequestTask extends AbstractTask {

    final private GitHubClient ghClient = GitHubClientAccessor.getClient();

    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String apiId = getProcessVariable(execution, "apiId");
        String version = getProcessVariable(execution, "version");
        String ghOrg = getProcessVariable(execution, "github:organization");
        String ghRepo = getProcessVariable(execution, "github:repository");
        String ghBranch = getProcessVariable(execution, "github:branch");
        String ghPath = getProcessVariable(execution, "github:path");
        String ghPullRequestBranch = getProcessVariable(execution, "github:pr:branch");
        boolean isNewPR = ghPullRequestBranch == null;
        
        ResourceCoordinates ghResourceCoords = ResourceCoordinates.builder()
                .organization(ghOrg)
                .repository(ghRepo)
                .branch(ghBranch)
                .path(ghPath)
                .build();

        try {
            String content = IoUtil.toString(hubClient.apis().byApiId(apiId).versions().byVersion(version).content().get().get());
            
            if (isNewPR) {
                createBranchAndPR(apiId, version, ghResourceCoords, content);
            } else {
                updateBranch(ghPullRequestBranch, ghResourceCoords, content);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private void createBranchAndPR(String apiId, String version, ResourceCoordinates ghResourceCoords, String content) {
        String newBranchName = "apicurio-lifecycle-" + apiId + ":" + version;
        String pullRequestId = ghClient.createBranchAndPullRequest(ghResourceCoords, content);
        
        addLabels(apiId, version, Map.of("github:pr:branch", newBranchName, "github:pr:id", pullRequestId));
    }

    private void updateBranch(String ghPullRequestBranch, ResourceCoordinates ghResourceCoords, String content) {
        ghClient.updateBranch(ghPullRequestBranch, ghResourceCoords, content);
    }

}
