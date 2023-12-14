package io.apicurio.lifecycle.workflows.activiti.tasks;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;

public class MicrocksTask implements JavaDelegate {
    
    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("[MicrocksTask] Executing for: " + execution.getVariable("apiId") + "@" + execution.getVariable("version"));
    }

}
