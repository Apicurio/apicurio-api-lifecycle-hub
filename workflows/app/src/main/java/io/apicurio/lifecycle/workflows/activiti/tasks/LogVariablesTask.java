package io.apicurio.lifecycle.workflows.activiti.tasks;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;

/**
 * Activiti task that will log all variables.
 */
public class LogVariablesTask implements JavaDelegate {
    
    /**
     * @see org.activiti.engine.delegate.JavaDelegate#execute(org.activiti.engine.delegate.DelegateExecution)
     */
    @Override
    public void execute(DelegateExecution execution) {
        System.out.println("[LogVariablesTask] === START ===");
        System.out.println("[LogVariablesTask] Logging variables.");
        execution.getVariables().forEach((k, v) -> {
            System.out.println("[LogVariablesTask] variable " + k + "=" + v);
        });
        System.out.println("[LogVariablesTask] ===  END  ===");
    }

}
