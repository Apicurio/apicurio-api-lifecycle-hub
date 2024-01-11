package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;

public class AddWorkflowLabelTask extends AbstractTask {

    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String apiId = getProcessVariable(execution, "apiId");
        String version = getProcessVariable(execution, "version");
        
        addLabels(apiId, version, Map.of(
                "workflow:definitionId", execution.getProcessDefinitionId(), 
                "workflow:instanceId", execution.getProcessInstanceId()));
    }

}
