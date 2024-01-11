package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;

import io.apicurio.lifecycle.workflows.github.GitHubClient;
import io.apicurio.lifecycle.workflows.github.GitHubClientAccessor;
import io.apicurio.lifecycle.workflows.github.ResourceCoordinates;
import io.apicurio.lifecycle.workflows.rest.clients.LifecycleHubClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.hub.LifecycleHubClient;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.Label;

public class FetchGitHubContentTask extends AbstractTask {

    final private LifecycleHubClient hubClient = LifecycleHubClientAccessor.getClient();
    final private GitHubClient ghClient = GitHubClientAccessor.getClient();

    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String apiId = getProcessVariable(execution, "apiId");
        String version = getProcessVariable(execution, "version");

        try {
            List<Label> labelList = hubClient.apis().byApiId(apiId).versions().byVersion(version).labels().get().get();
            Map<String, String> labels = toMap(labelList);
            
            String url = labels.get("github:url");
            
            ResourceCoordinates ghCoordinates = ghClient.resolveResource(url);
            
            // Fetch the content from GitHub
            String content = ghClient.downloadResource(ghCoordinates);
            byte[] contentBytes = content.getBytes();
            InputStream body = new ByteArrayInputStream(contentBytes);

            // Update the content in the hub
            hubClient.apis().byApiId(apiId).versions().byVersion(version).content().put(body).get();
            
            // Add some labels to expand on the github info.
            addLabels(apiId, version, Map.of(
                    "github:organization", ghCoordinates.getOrganization(),
                    "github:repository", ghCoordinates.getRepository(),
                    "github:branch", ghCoordinates.getBranch(),
                    "github:path", ghCoordinates.getPath()));

            // Set some process variables for use later in the flow.
            execution.setVariable("github:organization", ghCoordinates.getOrganization());
            execution.setVariable("github:repository", ghCoordinates.getRepository());
            execution.setVariable("github:branch", ghCoordinates.getBranch());
            execution.setVariable("github:path", ghCoordinates.getPath());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Map<String, String> toMap(List<Label> labelList) {
        Map<String, String> rval = new HashMap<>();
        labelList.forEach(label -> {
            rval.put(label.getKey(), label.getValue());
        });
        return rval;
    }

}
