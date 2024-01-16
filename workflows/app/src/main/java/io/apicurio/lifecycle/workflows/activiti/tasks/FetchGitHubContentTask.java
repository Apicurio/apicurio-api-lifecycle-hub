package io.apicurio.lifecycle.workflows.activiti.tasks;

import io.apicurio.lifecycle.workflows.AlwAppException;
import io.apicurio.lifecycle.workflows.github.GitFacade;
import io.apicurio.lifecycle.workflows.github.ResourceCoordinates;
import io.apicurio.lifecycle.workflows.rest.clients.LifecycleHubClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.hub.LifecycleHubClient;
import io.quarkus.arc.Arc;
import org.activiti.engine.delegate.DelegateExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Map;

public class FetchGitHubContentTask extends AbstractTask {

    private static final Logger log = LoggerFactory.getLogger(FetchGitHubContentTask.class);

    private final LifecycleHubClient hubClient = LifecycleHubClientAccessor.getClient();


    @Override
    public void execute(DelegateExecution execution) {
        String apiId = getProcessVariable(execution, ProcessVariables.API_ID);
        String version = getProcessVariable(execution, ProcessVariables.API_VERSION);

        try (var handle = Arc.container().instance(GitFacade.class)) {
            if (handle.isAvailable()) {
                var gitFacade = handle.get();

                Map<String, String> labels = getLabels(apiId, version);
                String url = labels.get(Labels.GITHUB_URL);
                ResourceCoordinates ghCoordinates = gitFacade.resolveResource(url);

                // Fetch the content from GitHub
                String content = gitFacade.downloadResource(ghCoordinates);

                byte[] contentBytes = content.getBytes();
                InputStream body = new ByteArrayInputStream(contentBytes);

                // Update the content in the hub
                hubClient.apis().byApiId(apiId).versions().byVersion(version).content().put(body).get();

                // Add some labels to expand on the github info.
                addLabels(apiId, version, Map.of(
                        Labels.GITHUB_ORG, ghCoordinates.getOrganization(),
                        Labels.GITHUB_REPO, ghCoordinates.getRepository(),
                        Labels.GITHUB_BRANCH, ghCoordinates.getBranch(),
                        Labels.GITHUB_PATH, ghCoordinates.getPath()));

                // Set some process variables for use later in the flow.
                execution.setVariable(ProcessVariables.GITHUB_ORG, ghCoordinates.getOrganization());
                execution.setVariable(ProcessVariables.GITHUB_REPO, ghCoordinates.getRepository());
                execution.setVariable(ProcessVariables.GITHUB_BRANCH, ghCoordinates.getBranch());
                execution.setVariable(ProcessVariables.GITHUB_PATH, ghCoordinates.getPath());

            } else {
                throw new AlwAppException("Could not get GitFacade bean.");
            }
        } catch (Exception ex) {
            log.error("Error during workflow execution.", ex);
        }
    }
}
