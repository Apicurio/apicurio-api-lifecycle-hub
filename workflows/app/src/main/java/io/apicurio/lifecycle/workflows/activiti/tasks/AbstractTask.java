package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.util.Map;

import org.activiti.engine.delegate.JavaDelegate;

import io.apicurio.lifecycle.rest.client.LifecycleHubClient;
import io.apicurio.lifecycle.rest.client.models.Labels;
import io.apicurio.lifecycle.rest.client.models.UpdateVersion;
import io.apicurio.lifecycle.rest.client.models.Version;
import io.apicurio.lifecycle.workflows.rest.clients.LifecycleHubClientAccessor;

public abstract class AbstractTask implements JavaDelegate {
    
    protected void addLabels(String apiId, String version, Map<String, Object> labels) {
        try {
            LifecycleHubClient client = LifecycleHubClientAccessor.getClient();

            System.out.println("[AbstractTask] Fetching existing version metadata.");
            Version apiVersion = client.apis().byApiId(apiId).versions().byVersion(version).get().get();
            Map<String, Object> existingLabels = apiVersion.getLabels().getAdditionalData();
            existingLabels.putAll(labels);

            UpdateVersion updateVersion = new UpdateVersion();
            updateVersion.setDescription(apiVersion.getDescription());
            updateVersion.setLabels(new Labels());
            updateVersion.getLabels().setAdditionalData(existingLabels);
            System.out.println("[AbstractTask] Updating version metadata with new labels.");
            client.apis().byApiId(apiId).versions().byVersion(version).put(updateVersion).get();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

}
