package io.apicurio.lifecycle.workflows.rest.clients;

import com.microsoft.kiota.authentication.AnonymousAuthenticationProvider;
import com.microsoft.kiota.http.OkHttpRequestAdapter;

import io.apicurio.registry.rest.client.RegistryClient;

public class RegistryClientAccessor {

    private static final RegistryClient client;
    static {
        String baseUrl = "http://localhost:9001/apis/registry/v3";

        OkHttpRequestAdapter adapter = new OkHttpRequestAdapter(new AnonymousAuthenticationProvider());
        adapter.setBaseUrl(baseUrl);
        client = new RegistryClient(adapter);
    }

    public static RegistryClient getClient() {
        return client;
    }
}
