package io.apicurio.lifecycle.workflows.rest.clients;

import com.microsoft.kiota.authentication.AnonymousAuthenticationProvider;
import com.microsoft.kiota.http.OkHttpRequestAdapter;

import io.apicurio.lifecycle.rest.client.LifecycleHubClient;

public class LifecycleHubClientAccessor {

    private static final LifecycleHubClient client;
    static {
        String baseUrl = "http://localhost:7070/apis/hub/v0";

        OkHttpRequestAdapter adapter = new OkHttpRequestAdapter(new AnonymousAuthenticationProvider());
        adapter.setBaseUrl(baseUrl);
        client = new LifecycleHubClient(adapter);
    }

    public static LifecycleHubClient getClient() {
        return client;
    }
}
