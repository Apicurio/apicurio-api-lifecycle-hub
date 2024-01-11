package io.apicurio.lifecycle.workflows.rest.v0;

import java.util.Map;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.slf4j.Logger;

import io.apicurio.lifecycle.workflows.rest.v0.beans.Event;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;

@ApplicationScoped
public class EventsResourceImpl implements EventsResource {

    @Inject
    Logger logger;

    @Inject
    ProcessEngine engine;

    /**
     * @see io.apicurio.lifecycle.workflows.rest.v0.EventsResource#publishEvent(io.apicurio.lifecycle.workflows.rest.v0.beans.Event)
     */
    @Override
    public void publishEvent(@NotNull Event data) {
        logger.info("Received an event: " + data.getType());
        
        if ("version:create".equals(data.getType())) {
            String apiId = data.getContext().getAdditionalProperties().get("apiId").toString();
            String version = data.getContext().getAdditionalProperties().get("version").toString();
            String workflow = data.getContext().getAdditionalProperties().getOrDefault("workflow", "default").toString();
            
            logger.info("Detected a version:create event.  Starting workflow: " + workflow + " for: " + apiId + "@" + version);
            
            // Start a workflow process instance for this API version.
            final Map<String, Object> variables = Map.of("apiId", apiId, "version", version);
            final RuntimeService runtimeService = engine.getRuntimeService();
            ProcessInstance id = runtimeService.startProcessInstanceByKey("workflow_" + workflow, variables);
            logger.info("Started a workflow process with id=" + id.getId());
        } else if ("version:change".equals(data.getType())) {
            String apiId = data.getContext().getAdditionalProperties().get("apiId").toString();
            String version = data.getContext().getAdditionalProperties().get("version").toString();
            
            logger.info("Detected a version:change event for: " + apiId + "@" + version);
            
            // Start a workflow process instance for this API version.
            final RuntimeService runtimeService = engine.getRuntimeService();

            // Find the right execution (1.0)
            Execution execution = runtimeService.createExecutionQuery()
                .messageEventSubscriptionName("ApiChangeMessage")
                .processVariableValueEquals("apiId", apiId)
                .processVariableValueEquals("version", version)
                .singleResult();

            // Dispatch message to the right process execution
            if (execution != null) {
                runtimeService.messageEventReceived("ApiChangeMessage", execution.getId(), Map.of("eventType", "change"));
            }
        } else if ("version:done".equals(data.getType())) {
            String apiId = data.getContext().getAdditionalProperties().get("apiId").toString();
            String version = data.getContext().getAdditionalProperties().get("version").toString();
            
            logger.info("Detected a version:done event for: " + apiId + "@" + version);
            
            // Start a workflow process instance for this API version.
            final RuntimeService runtimeService = engine.getRuntimeService();

            // Find the right execution (1.0)
            Execution execution = runtimeService.createExecutionQuery()
                .messageEventSubscriptionName("ApiChangeMessage")
                .processVariableValueEquals("apiId", apiId)
                .processVariableValueEquals("version", version)
                .singleResult();

            // Dispatch message to the right process execution
            runtimeService.messageEventReceived("ApiChangeMessage", execution.getId(), Map.of("eventType", "done"));
        }

    }

}
