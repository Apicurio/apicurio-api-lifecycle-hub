package io.apicurio.lifecycle.workflows.activiti;

import java.util.List;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.delegate.event.ActivitiActivityEvent;
import org.activiti.engine.delegate.event.ActivitiEvent;
import org.activiti.engine.delegate.event.ActivitiEventListener;
import org.activiti.engine.delegate.event.ActivitiEventType;
import org.activiti.engine.delegate.event.impl.ActivitiActivityEventImpl;
import org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.slf4j.Logger;

import io.agroal.api.AgroalDataSource;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;

@ApplicationScoped
public class ProcessEngineProducer {
    
    private static final boolean DEBUG = false;

    @Inject
    AgroalDataSource dataSource;
    
    @Inject
    Logger logger;

    private ProcessEngine engine;
    
    @Produces
    public ProcessEngine processEngine() {
        return engine;
    }

    @PostConstruct
    public void createProcessEngine() {
        if (engine == null) {
            logger.info("Creating a new ProcessEngine.");
            ProcessEngineConfiguration cfg = new StandaloneProcessEngineConfiguration()
                    .setDataSource(dataSource)
                    .setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
            engine = cfg.buildProcessEngine();
        }

        String pName = engine.getName();
        String ver = ProcessEngine.VERSION;
        logger.info("ProcessEngine [" + pName + "] Version: [" + ver + "]");

        RepositoryService repositoryService = engine.getRepositoryService();

        // Deploy processes
        logger.info("----------- Deploying workflows");
        List<String> processNames = List.of(
                "workflow_default.bpmn",
                "workflow_github.bpmn",
                
                "process_1.bpmn", 
                "process_startMessage.bpmn",
                "process_twoMessages.bpmn",
                "process_correlation.bpmn",
                "process_gateway.bpmn",
                "process_noGateway.bpmn",
                "process_humanTask.bpmn",
                "process_logVariables.bpmn"
        );
        processNames.forEach(processName -> {
            logger.info("Deploying process: " + processName);
            Deployment deployment = repositoryService.createDeployment()
                    .addClasspathResource("processes/" + processName).deploy();
            ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
                    .deploymentId(deployment.getId()).singleResult();
            logger.info(
                    "Found process definition ["
                            + processDefinition.getName() + "] with id ["
                            + processDefinition.getId() + "]");
        });
        logger.info("-----------");

        if (DEBUG) {
            // Install a listener on the runtime service, just for logging...
            engine.getRuntimeService().addEventListener(new ActivitiEventListener() {
                @Override
                public void onEvent(ActivitiEvent event) {
                    logger.info("Process event: " + event.getType());
                    if (event.getType() == ActivitiEventType.ACTIVITY_STARTED) {
                        ActivitiActivityEventImpl aae = (ActivitiActivityEventImpl) event;
                        logger.info("   Activity ID: " + aae.getActivityId());
                    }
                }
                @Override
                public boolean isFailOnException() {
                    return false;
                }
            });
        }

        // Always log certain events
        engine.getRuntimeService().addEventListener(new ActivitiEventListener() {
            @Override
            public void onEvent(ActivitiEvent event) {
                if (event.getType() == ActivitiEventType.PROCESS_STARTED) {
                    logger.info("Process instance created/started.");
                } else if (event.getType() == ActivitiEventType.ACTIVITY_STARTED) {
                    logger.info("Executing activity: " + ((ActivitiActivityEvent) event).getActivityId());
                } else if (event.getType() == ActivitiEventType.PROCESS_COMPLETED) {
                    logger.info("Process completed!");
                }
            }
            @Override
            public boolean isFailOnException() {
                return false;
            }
        });
        
    }

}
