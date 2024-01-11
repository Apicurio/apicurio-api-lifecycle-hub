package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.workflows.rest.clients.RegistryClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.Api;
import io.apicurio.lifecycle.workflows.rest.clients.hub.models.Version;
import io.apicurio.lifecycle.workflows.rest.clients.registry.RegistryClient;
import io.apicurio.lifecycle.workflows.rest.clients.registry.models.ArtifactContent;
import io.apicurio.lifecycle.workflows.rest.clients.registry.models.ArtifactMetaData;

public class RegistryTask extends AbstractTask {

    private final RegistryClient registryClient = RegistryClientAccessor.getClient();
    
    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String apiId = getProcessVariable(execution, "apiId");
        String version = getProcessVariable(execution, "version");
        String registryGroup = getProcessVariable(execution, "registryGroup", "default");
        String registryArtifactId = getProcessVariable(execution, "registryArtifactId", apiId);
        String registryVersion = getProcessVariable(execution, "registryVersion", version);

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
            final String name = api.getName() != null ? api.getName() : registryArtifactId;
            final String description = apiVersion.getDescription() != null ? apiVersion.getDescription() : "";
            ArtifactMetaData amd = registryClient.groups().byGroupId(registryGroup).artifacts().post(newArtifact, config -> {
                config.queryParameters.ifExists = "RETURN_OR_UPDATE";
                config.headers.add("X-Registry-ArtifactType", "OPENAPI");
                config.headers.add("X-Registry-ArtifactId", registryArtifactId);
                config.headers.add("X-Registry-Version", registryVersion);
                config.headers.add("X-Registry-Name", name);
                config.headers.add("X-Registry-Description", description);
            }).get();
            
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            addLabels(apiId, version, Map.of(
                    "registry:registeredOn", sdf.format(new Date()),
                    "registry:groupId", registryGroup,
                    "registry:artifactId", registryArtifactId,
                    "registry:version", amd.getVersion()));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        
    }

}
