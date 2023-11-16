/*
 * Copyright 2023 Red Hat Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.lifecycle.rest;

import java.util.concurrent.ExecutionException;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.apicurio.lifecycle.rest.client.models.Api;
import io.apicurio.lifecycle.rest.client.models.ApiType;
import io.apicurio.lifecycle.rest.client.models.NewApi;
import io.apicurio.lifecycle.rest.client.models.UpdateApi;
import io.quarkus.test.junit.QuarkusTest;

/**
 * @author eric.wittmann@gmail.com
 */
@QuarkusTest
public class ApisResourceTest extends AbstractResourceTest {

    @Test
    public void testCreateApi() throws Exception {
        NewApi newApi = new NewApi();
        newApi.setApiId("testCreateApi");
        newApi.setType("OPENAPI");
        newApi.setEncoding("application/json");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");

        client().apis().post(newApi).get();
    }

    @Test
    public void testGetApi() throws Exception {
        NewApi newApi = new NewApi();
        newApi.setApiId("testGetApi");
        newApi.setType("OPENAPI");
        newApi.setEncoding("application/json");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");

        client().apis().post(newApi).get();
        
        Api api = client().apis().byApiId("testGetApi").get().get();
        Assertions.assertEquals("testGetApi", api.getApiId());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
        Assertions.assertEquals("application/json", api.getEncoding());
        Assertions.assertEquals("Test API", api.getName());
        Assertions.assertEquals("My test API is here.", api.getDescription());
    }

    @Test
    public void testDeleteApi() throws Exception {
        String apiId = "testDeleteApi";
        
        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setEncoding("application/json");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");

        // Create the api
        client().apis().post(newApi).get();
        
        // Make sure we can get it.
        client().apis().byApiId(apiId).get().get();
        
        // Delete it.
        client().apis().byApiId(apiId).delete().get();

        // Cannot get it anymore.
        Assertions.assertThrows(ExecutionException.class, () -> {
            client().apis().byApiId(apiId).get().get();
        });
    }

    @Test
    public void testUpdateApi() throws Exception {
        String apiId = "testUpdateApi";
        
        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setEncoding("application/json");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");
        client().apis().post(newApi).get();
        
        Api api = client().apis().byApiId(apiId).get().get();
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("My test API is here.", api.getDescription());
        Assertions.assertEquals("application/json", api.getEncoding());
        Assertions.assertEquals("Test API", api.getName());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
        
        UpdateApi update = new UpdateApi();
        update.setName("New Name API");
        update.setDescription("This is a new description.");
        client().apis().byApiId(apiId).put(update).get();
        
        api = client().apis().byApiId(apiId).get().get();
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("This is a new description.", api.getDescription());
        Assertions.assertEquals("application/json", api.getEncoding());
        Assertions.assertEquals("New Name API", api.getName());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
    }

}
