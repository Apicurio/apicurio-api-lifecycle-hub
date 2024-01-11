package io.apicurio.lifecycle.workflows.activiti;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
public class ProcessEngineTest {

    @Inject
    Logger logger;
    
    @Inject
    ProcessEngine engine;

    @Test
    public void testCreateEngine() throws Exception {
        Assertions.assertEquals("default", engine.getName());
    }

    @Test
    public void testRunProcess1() throws Exception {
        logger.info("\n\n==\nTest: testRunProcess1");
        final Map<String, Object> variables = new HashMap<String, Object>();
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_1", variables);
        logger.info("Started Process Id: " + id.getId());
    }

    @Test
    public void testRunProcessWithStartMessage() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithStartMessage");
        final Map<String, Object> variables = Map.of("apiId", "test-api", "version", "1.0");
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_startMessage", variables);
        logger.info("Started Process Id: " + id.getId());
    }

    @Test
    public void testRunProcessWithLogVariables() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithLogVariables");
        final Map<String, Object> variables = Map.of("apiId", "variables-api", "version", "1.0");
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_logVariables", variables);
        logger.info("Started Process Id: " + id.getId());
    }

    @Test
    public void testRunProcessWithCorrelation() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithCorrelation");
        final Map<String, Object> variables = Map.of("apiId", "correlation-api", "version", "1.0");
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_correlation", variables);
        logger.info("Started Process Id: " + id.getId());
        
        Thread.sleep(500);
        
        Execution execution = runtimeService.createExecutionQuery()
            .messageEventSubscriptionName("MyMessage")
            .singleResult();
        
        logger.info("Sending message to: " + id.getId());
        runtimeService.messageEventReceived("MyMessage", execution.getId());
        Thread.sleep(500);
    }

    @Test
    public void testRunProcessWithCorrelation_2x() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithCorrelation_2x");
        Map<String, Object> variables = Map.of("apiId", "correlation-x2-api", "version", "1.0");
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_correlation", variables);
        logger.info("Started Process Id (v1.0): " + id.getId());

        Thread.sleep(500);

        variables = Map.of("apiId", "correlation-x2-api", "version", "1.1");
        id = runtimeService.startProcessInstanceByKey("process_correlation", variables);
        logger.info("Started Process Id (v1.1): " + id.getId());

        // Find the right execution (1.0)
        Execution execution = runtimeService.createExecutionQuery()
            .messageEventSubscriptionName("MyMessage")
            .processVariableValueEquals("apiId", "correlation-x2-api")
            .processVariableValueEquals("version", "1.0")
            .singleResult();

        // Dispatch message to process for version 1.0 (only)
        logger.info("Sending message to: " + id.getId());
        runtimeService.messageEventReceived("MyMessage", execution.getId());
    }

    @Test
    public void testRunProcessWithGateway() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithGateway");
        final Map<String, Object> variables = Map.of("count", 0);
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_gateway", variables);
        logger.info("Started Process Id: " + id.getId());
    }

    @Test
    public void testRunProcessWithHumanTask() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithHumanTask");
        final Map<String, Object> variables = Map.of("message", "Hello, user.");
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_humanTask", variables);
        logger.info("Started Process Id: " + id.getId());
        
        TaskQuery taskQuery = engine.getTaskService().createTaskQuery();
        List<Task> tasks = taskQuery.list();
        
        for (Task task : tasks) {
            System.out.println("Task: " + task.getId());
            System.out.println("      " + task.getName());
            System.out.println("      " + task.getDescription());
            System.out.println("      " + task.getAssignee());
            System.out.println("      " + task.getExecutionId());
            System.out.println("      " + task.getTaskDefinitionKey());
            engine.getTaskService().claim(task.getId(), "user");
            engine.getTaskService().complete(task.getId(), Map.of("approval", true));
        }
    }

    @Test
    public void testRunProcessWithNoGateway() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithNoGateway");
        final Map<String, Object> variables = new HashMap<String, Object>();
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_noGateway", variables);
        logger.info("Started Process Id: " + id.getId());
    }

    @Test
    public void testRunProcessWithTwoMessages() throws Exception {
        logger.info("\n\n==\nTest: testRunProcessWithTwoMessages");
        final Map<String, Object> variables = Map.of("name", "foo:bar");
        final RuntimeService runtimeService = engine.getRuntimeService();
        ProcessInstance id = runtimeService.startProcessInstanceByKey("process_twoMessages", variables);
        logger.info("Started Process Id: " + id.getId());

        // Find the right execution (1.0)
        Execution execution = runtimeService.createExecutionQuery()
            .messageEventSubscriptionName("Message2")
            .processVariableValueEquals("name", "foo:bar")
            .singleResult();

        // Dispatch message to process for version 1.0 (only)
        logger.info("Sending message to: " + id.getId());
        runtimeService.messageEventReceived("Message2", execution.getId(), Map.of("messageName",  "Message2"));
    }
}
