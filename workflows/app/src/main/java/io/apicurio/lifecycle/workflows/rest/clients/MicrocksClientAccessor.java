package io.apicurio.lifecycle.workflows.rest.clients;

import io.apicurio.lifecycle.workflows.rest.clients.microcks.MicrocksClient;

public class MicrocksClientAccessor {

    private static final MicrocksClient client;
    static {
        String baseUrl = "http://localhost:8080/api";
        client = new MicrocksClient(baseUrl);
    }

    public static MicrocksClient getClient() {
        return client;
    }
}
