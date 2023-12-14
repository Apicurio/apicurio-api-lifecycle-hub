package io.apicurio.lifecycle.workflows.activiti.tasks;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;

/**
 * Activiti task that will log all variables.
 */
public class IncrementCountTask implements JavaDelegate {
    
    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("[IncrementCountTask] Incrementing count.");
        int count = ((Number) execution.getVariable("count")).intValue();
        count++;
        execution.setVariable("count", Long.valueOf(count));
        System.out.println("[IncrementCountTask] Count incremented to: " + count);
    }

}
