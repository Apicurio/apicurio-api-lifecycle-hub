package io.apicurio.lifecycle.workflows.rest.clients;

import io.apicurio.lifecycle.workflows.rest.clients.microcks.MicrocksClient;

public class MicrocksClientNotTest {
    
    private static String EMPTY_API = "{\n"
            + "    \"openapi\": \"3.0.2\",\n"
            + "    \"info\": {\n"
            + "        \"title\": \"Empty API\",\n"
            + "        \"version\": \"1.0.0\",\n"
            + "        \"description\": \"Just an empty API.\"\n"
            + "    }\n"
            + "}";

    public static void main(String[] args) throws Exception {
        MicrocksClient client = MicrocksClientAccessor.getClient();
        
        String content = EMPTY_API;
        client.upload("empty-api.json", content);
    }

}
