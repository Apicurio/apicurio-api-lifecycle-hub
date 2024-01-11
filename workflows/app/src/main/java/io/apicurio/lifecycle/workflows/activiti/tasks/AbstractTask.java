package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;

import io.apicurio.lifecycle.workflows.rest.clients.LifecycleHubClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.hub.LifecycleHubClient;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.Labels;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.UpdateVersion;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.Version;

public abstract class AbstractTask implements JavaDelegate {
    
    final protected LifecycleHubClient hubClient = LifecycleHubClientAccessor.getClient();

    protected void addLabels(String apiId, String version, Map<String, Object> labels) {
        try {
            System.out.println("[AbstractTask] Fetching existing version metadata.");
            Version apiVersion = hubClient.apis().byApiId(apiId).versions().byVersion(version).get().get();
            Map<String, Object> existingLabels = apiVersion.getLabels().getAdditionalData();
            existingLabels.putAll(labels);

            UpdateVersion updateVersion = new UpdateVersion();
            updateVersion.setDescription(apiVersion.getDescription());
            updateVersion.setLabels(new Labels());
            updateVersion.getLabels().setAdditionalData(existingLabels);
            System.out.println("[AbstractTask] Updating version metadata with new labels.");
            hubClient.apis().byApiId(apiId).versions().byVersion(version).put(updateVersion).get();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
    
    protected String getProcessVariable(DelegateExecution execution, String varName) {
        return getProcessVariable(execution, varName, null);
    }

    protected String getProcessVariable(DelegateExecution execution, String varName, String defaultValue) {
        if (execution.hasVariable(varName)) {
            return execution.getVariable(varName).toString();
        }
        return defaultValue;
    }

}
