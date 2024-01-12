package io.apicurio.lifecycle.workflows.activiti.tasks;

import io.apicurio.lifecycle.workflows.AlwAppException;
import io.apicurio.lifecycle.workflows.rest.clients.LifecycleHubClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.hub.LifecycleHubClient;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.Labels;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.UpdateVersion;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.Version;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import static java.util.Map.entry;

public abstract class AbstractTask implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(AbstractTask.class);

    final protected LifecycleHubClient hubClient = LifecycleHubClientAccessor.getClient();

    // TODO: Why are labels Map<String, Object> instead of Map<String, String> ?
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


    protected Map<String, String> getLabels(String apiId, String version) {
        try {
            var labels = hubClient.apis().byApiId(apiId).versions().byVersion(version).labels().get().get();
            if (labels == null) {
                return Map.of();
            }
            return labels
                    .stream()
                    .map(e -> entry(e.getKey(), e.getValue()))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        } catch (InterruptedException | ExecutionException ex) {
            log.error("Could not get labels for '%s:%s'.".formatted(apiId, version), ex);
            throw new AlwAppException(ex);
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
