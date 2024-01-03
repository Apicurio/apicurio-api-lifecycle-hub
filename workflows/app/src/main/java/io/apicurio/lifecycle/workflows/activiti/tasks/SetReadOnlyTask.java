package io.apicurio.lifecycle.workflows.activiti.tasks;

import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;

/**
 * Activiti task that will set the readOnly label to true or false.
 */
public class SetReadOnlyTask extends AbstractTask {
    
    private Expression isReadOnly;

    /**
     * @return the isReadOnly
     */
    public Expression getIsReadOnly() {
        return isReadOnly;
    }

    /**
     * @param isReadOnly the isReadOnly to set
     */
    public void setIsReadOnly(Expression isReadOnly) {
        this.isReadOnly = isReadOnly;
    }
    
    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        String apiId = execution.getVariable("apiId").toString();
        String version = execution.getVariable("apiVersion").toString();
        
        addLabels(apiId, version, Map.of("version:readOnly", isReadOnly.getValue(execution)));
    }

}
