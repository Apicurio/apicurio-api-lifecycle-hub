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

import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.rest.client.models.Api;
import io.apicurio.lifecycle.rest.client.models.ApiType;
import io.apicurio.lifecycle.rest.client.models.Labels;
import io.apicurio.lifecycle.rest.client.models.NewApi;
import io.apicurio.lifecycle.rest.client.models.NewContent;
import io.apicurio.lifecycle.rest.client.models.NewVersion;
import io.apicurio.lifecycle.rest.client.models.UpdateApi;
import io.apicurio.lifecycle.rest.client.models.UpdateVersion;
import io.apicurio.lifecycle.rest.client.models.Version;
import io.apicurio.lifecycle.rest.client.models.VersionSearchResults;
import io.quarkus.test.junit.QuarkusTest;

/**
 * @author eric.wittmann@gmail.com
 */
@QuarkusTest
public class ApisResourceTest extends AbstractResourceTest {

    private static final String EMPTY_OPENAPI_CONTENT = "{\n"
            + "    \"openapi\": \"3.0.2\",\n"
            + "    \"info\": {\n"
            + "        \"title\": \"Empty API\",\n"
            + "        \"version\": \"1.0.0\",\n"
            + "        \"description\": \"Just an empty API.\"\n"
            + "    }\n"
            + "}";

    private static final String EMPTY_OPENAPI_CONTENT_UPDATED = "{\n"
            + "    \"openapi\": \"3.0.2\",\n"
            + "    \"info\": {\n"
            + "        \"title\": \"Empty API (updated)\",\n"
            + "        \"version\": \"1.0.1\",\n"
            + "        \"description\": \"Just an empty, but updated API.\"\n"
            + "    }\n"
            + "}";

    @Test
    public void testCreateApi() throws Exception {
        String apiId = "testCreateApi";

        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");

        client().apis().post(newApi).get();
    }

    @Test
    public void testGetApi() throws Exception {
        String apiId = "testGetApi";

        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");

        client().apis().post(newApi).get();
        
        Api api = client().apis().byApiId(apiId).get().get();
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
        Assertions.assertEquals("Test API", api.getName());
        Assertions.assertEquals("My test API is here.", api.getDescription());
    }

    @Test
    public void testDeleteApi() throws Exception {
        String apiId = "testDeleteApi";
        
        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
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
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");
        client().apis().post(newApi).get();
        
        Api api = client().apis().byApiId(apiId).get().get();
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("My test API is here.", api.getDescription());
        Assertions.assertEquals("Test API", api.getName());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
        
        UpdateApi update = new UpdateApi();
        update.setName("New Name API");
        update.setDescription("This is a new description.");
        client().apis().byApiId(apiId).put(update).get();
        
        api = client().apis().byApiId(apiId).get().get();
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("This is a new description.", api.getDescription());
        Assertions.assertEquals("New Name API", api.getName());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
    }

    @Test
    public void testApiLabels() throws Exception {
        String apiId = "testApiLabels";
        
        Labels labels = new Labels();
        labels.setAdditionalData(Map.of("foo", "bar"));
        
        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setName("Test API");
        newApi.setLabels(labels);
        client().apis().post(newApi).get();
        
        Api api = client().apis().byApiId(apiId).get().get();
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("Test API", api.getName());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
        Assertions.assertEquals(1, api.getLabels().getAdditionalData().size());
        
        labels.setAdditionalData(Map.of("one", "1", "two", "2", "three", "3"));
        
        UpdateApi update = new UpdateApi();
        update.setName("New Name API");
        update.setLabels(labels);
        client().apis().byApiId(apiId).put(update).get();
        
        api = client().apis().byApiId(apiId).get().get();
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("New Name API", api.getName());
        Assertions.assertEquals(ApiType.OPENAPI, api.getType());
        Assertions.assertEquals(3, api.getLabels().getAdditionalData().size());
    }
    
    @Test
    public void testCreateVersion() throws Exception {
        String apiId = "testCreateVersion";

        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");
        client().apis().post(newApi).get();

        NewContent newContent = new NewContent();
        newContent.setContentType("application/json");
        newContent.setContent(EMPTY_OPENAPI_CONTENT);
        NewVersion newVersion = new NewVersion();
        newVersion.setVersion("1.0");
        newVersion.setDescription("Version one.");
        newVersion.setContent(newContent);
        client().apis().byApiId(apiId).versions().post(newVersion).get();
    }
    
    @Test
    public void testSearchVersions() throws Exception {
        String apiId = "testSearchVersions";

        // Create API
        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setName("Test API");
        newApi.setDescription("My test API is here.");
        client().apis().post(newApi).get();

        // Create two versions
        NewContent newContent = new NewContent();
        newContent.setContentType("application/json");
        newContent.setContent(EMPTY_OPENAPI_CONTENT);
        NewVersion newVersion = new NewVersion();
        newVersion.setVersion("1.0");
        newVersion.setDescription("Version one.");
        newVersion.setContent(newContent);
        client().apis().byApiId(apiId).versions().post(newVersion).get();
        
        Thread.sleep(10);

        newContent = new NewContent();
        newContent.setContentType("application/json");
        newContent.setContent(EMPTY_OPENAPI_CONTENT_UPDATED);
        newVersion = new NewVersion();
        newVersion.setVersion("2.0");
        newVersion.setDescription("Version two.");
        newVersion.setContent(newContent);
        client().apis().byApiId(apiId).versions().post(newVersion).get();
        
        VersionSearchResults results = client().apis().byApiId(apiId).versions().get().get();
        Assertions.assertEquals(2, results.getCount());
        Assertions.assertEquals("2.0", results.getVersions().get(0).getVersion());
        Assertions.assertEquals("application/json", results.getVersions().get(0).getContentType());
        Assertions.assertEquals("Version two.", results.getVersions().get(0).getDescription());
    }

    @Test
    public void testVersionLabels() throws Exception {
        String apiId = "testVersionLabels";

        Labels labels = new Labels();
        labels.setAdditionalData(Map.of("foo", "bar"));
        
        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setName("Test API");
        newApi.setLabels(labels);
        client().apis().post(newApi).get();
       
        NewContent newContent = new NewContent();
        newContent.setContentType("application/json");
        newContent.setContent(EMPTY_OPENAPI_CONTENT);
        NewVersion newVersion = new NewVersion();
        newVersion.setVersion("1.0");
        newVersion.setLabels(labels);
        newVersion.setContent(newContent);
        client().apis().byApiId(apiId).versions().post(newVersion).get();

        
        Version version = client().apis().byApiId(apiId).versions().byVersion("1.0").get().get();
        Assertions.assertEquals("1.0", version.getVersion());
        Assertions.assertEquals(1, version.getLabels().getAdditionalData().size());
        
        labels.setAdditionalData(Map.of("one", "1", "two", "2", "three", "3"));
        
        UpdateVersion update = new UpdateVersion();
        update.setLabels(labels);
        client().apis().byApiId(apiId).versions().byVersion("1.0").put(update).get();
        
        version = client().apis().byApiId(apiId).versions().byVersion("1.0").get().get();
        Assertions.assertEquals("1.0", version.getVersion());
        Assertions.assertEquals(3, version.getLabels().getAdditionalData().size());
    }

    
    @Test
    public void testGetVersionContent() throws Exception {
        String apiId = "testGetVersionContent";

        NewApi newApi = new NewApi();
        newApi.setApiId(apiId);
        newApi.setType("OPENAPI");
        newApi.setName("Test API");
        client().apis().post(newApi).get();

        NewContent newContent = new NewContent();
        newContent.setContentType("application/json");
        newContent.setContent(EMPTY_OPENAPI_CONTENT);
        NewVersion newVersion = new NewVersion();
        newVersion.setVersion("1.0");
        newVersion.setDescription("Version one.");
        newVersion.setContent(newContent);
        client().apis().byApiId(apiId).versions().post(newVersion).get();
        
        InputStream inputStream = client().apis().byApiId(apiId).versions().byVersion("1.0").content().get().get();
        String content = IoUtil.toString(inputStream);
        Assertions.assertTrue(content.contains("Empty API"));
    }

}
