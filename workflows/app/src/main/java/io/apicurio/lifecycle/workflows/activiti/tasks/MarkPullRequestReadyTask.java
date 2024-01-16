package io.apicurio.lifecycle.workflows.activiti.tasks;

import io.apicurio.lifecycle.workflows.AlwAppException;
import io.apicurio.lifecycle.workflows.github.GitFacade;
import io.apicurio.lifecycle.workflows.github.ResourceCoordinates;
import io.quarkus.arc.Arc;
import org.activiti.engine.delegate.DelegateExecution;

import static io.apicurio.lifecycle.workflows.activiti.tasks.Util.parseLongONull;

public class MarkPullRequestReadyTask extends AbstractTask {


    @Override
    public void execute(DelegateExecution execution) {
        try (var handle = Arc.container().instance(GitFacade.class)) {
            if (handle.isAvailable()) {
                var gitFacade = handle.get();

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

                gitFacade.markPullRequestReady(ghResourceCoords);
            } else {
                throw new AlwAppException("Could not get GitFacade bean.");
            }
        }
    }
}
