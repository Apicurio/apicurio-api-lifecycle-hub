package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.rest.client.LifecycleHubClient;
import io.apicurio.lifecycle.workflows.rest.clients.LifecycleHubClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.MicrocksClientAccessor;
import io.apicurio.lifecycle.workflows.rest.clients.microcks.MicrocksClient;

public class MicrocksTask extends AbstractTask {
    
    private final LifecycleHubClient hubClient = LifecycleHubClientAccessor.getClient();
    private final MicrocksClient microcksClient = MicrocksClientAccessor.getClient();
    
    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String apiId = execution.getVariable("apiId").toString();
        String version = execution.getVariable("apiVersion").toString();

        try {
            System.out.println("[MicrocksTask] Executing for: " + apiId + "@" + version);
            // Get version content.
            InputStream contentStream = hubClient.apis().byApiId(apiId).versions().byVersion(version).content().get().get();
            String content = IoUtil.toString(contentStream);
            
            // Push to microcks
            microcksClient.upload(apiId + ".json", content);

            // Update labels
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            addLabels(apiId, version, Map.of(
                    "microcks:pushedOn", sdf.format(new Date())));

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
        
    }

}
