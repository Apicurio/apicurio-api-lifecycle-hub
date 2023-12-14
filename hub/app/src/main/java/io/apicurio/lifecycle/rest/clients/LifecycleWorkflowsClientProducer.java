package io.apicurio.lifecycle.rest.clients;

import org.slf4j.Logger;

import com.microsoft.kiota.authentication.AnonymousAuthenticationProvider;
import com.microsoft.kiota.http.OkHttpRequestAdapter;

import io.apicurio.lifecycle.workflows.rest.client.LifecycleWorkflowsClient;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;

@ApplicationScoped
public class LifecycleWorkflowsClientProducer {

    @Inject
    Logger logger;

    private LifecycleWorkflowsClient client;
    
    @Produces
    public LifecycleWorkflowsClient produceClient() {
        return client;
    }
    
    @PostConstruct
    protected void createClient() {
        String baseUrl = "http://localhost:9002/apis/workflows/v0";
        
        OkHttpRequestAdapter adapter = new OkHttpRequestAdapter(new AnonymousAuthenticationProvider());
        adapter.setBaseUrl(baseUrl);
        client = new LifecycleWorkflowsClient(adapter);

    }
}
