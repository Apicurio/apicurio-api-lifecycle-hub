package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.rest.client.LifecycleHubClient;
import io.apicurio.lifecycle.rest.client.models.Api;
import io.apicurio.lifecycle.rest.client.models.Version;
import io.apicurio.lifecycle.workflows.rest.clients.LifecycleHubClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.RegistryClientAccessor;
import io.apicurio.registry.rest.client.RegistryClient;
import io.apicurio.registry.rest.client.models.ArtifactContent;

public class RegistryTask extends AbstractTask {

    private final RegistryClient registryClient = RegistryClientAccessor.getClient();
    private final LifecycleHubClient hubClient = LifecycleHubClientAccessor.getClient();
    
    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String apiId = execution.getVariable("apiId").toString();
        String version = execution.getVariable("version").toString();

        try {
            System.out.println("[RegistryTask] Executing for: " + apiId + "@" + version);
            // Get version content.
            InputStream contentStream = hubClient.apis().byApiId(apiId).versions().byVersion(version).content().get().get();
            String content = IoUtil.toString(contentStream);
            
            // Get API and version metadata
            Api api = hubClient.apis().byApiId(apiId).get().get();
            Version apiVersion = hubClient.apis().byApiId(apiId).versions().byVersion(version).get().get();
            
            // Register on Registry
            ArtifactContent newArtifact = new ArtifactContent();
            newArtifact.setContent(content);
            final String groupId = "default";
            final String artifactId = apiId;
            final String name = api.getName() != null ? api.getName() : artifactId;
            final String description = apiVersion.getDescription() != null ? apiVersion.getDescription() : "";
            registryClient.groups().byGroupId(groupId).artifacts().post(newArtifact, config -> {
                config.queryParameters.ifExists = "RETURN_OR_UPDATE";
                config.headers.add("X-Registry-ArtifactType", "OPENAPI");
                config.headers.add("X-Registry-ArtifactId", artifactId);
                config.headers.add("X-Registry-Version", version);
                config.headers.add("X-Registry-Name", name);
                config.headers.add("X-Registry-Description", description);
            }).get();
            
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            addLabels(apiId, version, Map.of(
                    "registry:registeredOn", sdf.format(new Date()),
                    "registry:coordinates", groupId + "/" + artifactId));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        
    }

}
