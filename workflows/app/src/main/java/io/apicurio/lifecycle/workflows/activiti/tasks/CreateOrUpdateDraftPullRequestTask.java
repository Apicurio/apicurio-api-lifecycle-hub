package io.apicurio.lifecycle.workflows.activiti.tasks;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.workflows.AlwAppException;
import io.apicurio.lifecycle.workflows.github.GitFacade;
import io.apicurio.lifecycle.workflows.github.ResourceCoordinates;
import io.quarkus.arc.Arc;
import org.activiti.engine.delegate.DelegateExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import static io.apicurio.lifecycle.workflows.activiti.tasks.Labels.*;
import static io.apicurio.lifecycle.workflows.activiti.tasks.Util.parseLongONull;

public class CreateOrUpdateDraftPullRequestTask extends AbstractTask {

    private static final Logger log = LoggerFactory.getLogger(CreateOrUpdateDraftPullRequestTask.class);


    @Override
    public void execute(DelegateExecution execution) {

        String apiId = getProcessVariable(execution, ProcessVariables.API_ID);
        String version = getProcessVariable(execution, ProcessVariables.API_VERSION);

        var labels = getLabels(apiId, version);

        var ghResourceCoords = ResourceCoordinates.builder()
                .organization(getProcessVariable(execution, ProcessVariables.GITHUB_ORG))
                .repository(getProcessVariable(execution, ProcessVariables.GITHUB_REPO))
                .branch(getProcessVariable(execution, ProcessVariables.GITHUB_BRANCH))
                .path(getProcessVariable(execution, ProcessVariables.GITHUB_PATH))
                .ghPRId(parseLongONull(labels.get(Labels.GITHUB_PR_ID)))
                .ghPRNodeId(getProcessVariable(execution, ProcessVariables.GITHUB_PR_NODE_ID))
                .ghPRBranch(labels.get(Labels.GITHUB_PR_BRANCH))
                .ghPRWebURL(labels.get(Labels.GITHUB_PR_WEB_URL))
                .build();

        try (var handle = Arc.container().instance(GitFacade.class)) {
            if (handle.isAvailable()) {
                var gitFacade = handle.get();

                String content = IoUtil.toString(hubClient.apis().byApiId(apiId).versions().byVersion(version).content().get().get());

                if (ghResourceCoords.getGhPRId() == null) {
                    createBranchAndPR(execution, apiId, version, gitFacade, ghResourceCoords, content);
                } else {
                    updateBranch(gitFacade, ghResourceCoords, content);
                }

            } else {
                throw new AlwAppException("Could not get GitFacade bean.");
            }
        } catch (Exception ex) {
            log.error("Error during workflow execution.", ex);
        }
    }


    private void createBranchAndPR(DelegateExecution execution, String apiId, String version, GitFacade gitFacade, ResourceCoordinates ghResourceCoords, String content) {
        ghResourceCoords.setGhPRBranch("update-api-" + apiId + "-version-" + version);
        gitFacade.createBranchAndPullRequest(apiId, version, ghResourceCoords, content);
        if (ghResourceCoords.getGhPRId() != null) {
            addLabels(apiId, version, Map.of(
                    GITHUB_PR_ID, ghResourceCoords.getGhPRId(),
                    GITHUB_PR_BRANCH, ghResourceCoords.getGhPRBranch(),
                    GITHUB_PR_WEB_URL, ghResourceCoords.getGhPRWebURL()
            ));
            execution.setVariable(ProcessVariables.GITHUB_PR_NODE_ID, ghResourceCoords.getGhPRNodeId());
        }
    }


    private void updateBranch(GitFacade gitFacade, ResourceCoordinates ghResourceCoords, String content) {
        gitFacade.updateBranch(ghResourceCoords, content);
    }
}
