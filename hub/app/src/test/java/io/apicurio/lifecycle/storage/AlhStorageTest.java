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

package io.apicurio.lifecycle.storage;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;

import io.apicurio.lifecycle.storage.dtos.ApiDto;
import io.apicurio.lifecycle.storage.dtos.LabelDto;
import io.apicurio.lifecycle.storage.dtos.NewApiDto;
import io.apicurio.lifecycle.storage.dtos.NewVersionDto;
import io.apicurio.lifecycle.storage.dtos.UpdateApiDto;
import io.apicurio.lifecycle.storage.dtos.UpdateVersionDto;
import io.apicurio.lifecycle.storage.dtos.VersionDto;
import io.apicurio.lifecycle.storage.exceptions.AlhAlreadyExistsException;
import io.apicurio.lifecycle.storage.exceptions.AlhNotFoundException;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

/**
 * @author eric.wittmann@gmail.com
 */
@QuarkusTest
public class AlhStorageTest {

    @Inject
    Logger log;
    
    @Inject
    AlhStorage storage;

    private static boolean containsLabel(List<LabelDto> labels, String name, String value) {
        List<LabelDto> filtered = labels.stream().filter(label -> label.getKey().equals(name) && label.getValue().equals(value)).collect(Collectors.toList());
        return !filtered.isEmpty();
    }

    @Test
    public void testCreateApi() throws Exception {
        String apiId = "AlhStorageTest_testCreateApi";
        
        storage.createAPI(NewApiDto.builder()
                .apiId(apiId)
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .description("My test API is here.")
                .build());
    }

    @Test
    public void testCreateApi_409() throws Exception {
        String apiId = "AlhStorageTest_testCreateApi_409";
        storage.createAPI(NewApiDto.builder()
                .apiId(apiId)
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .build());

        Assertions.assertThrows(AlhAlreadyExistsException.class, () -> {
            storage.createAPI(NewApiDto.builder()
                    .apiId(apiId)
                    .type("OPENAPI")
                    .encoding("application/json")
                    .name("Test API")
                    .build());
        });
    }
    
    @Test
    public void testGetApiById() throws Exception {
        storage.createAPI(NewApiDto.builder()
                .apiId("testGetApiById")
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .description("My test API is here.")
                .build());
        
        ApiDto api = storage.getApi("testGetApiById");
        Assertions.assertEquals("testGetApiById", api.getApiId());
        Assertions.assertEquals("My test API is here.", api.getDescription());
        Assertions.assertEquals("application/json", api.getEncoding());
        Assertions.assertEquals("Test API", api.getName());
        Assertions.assertEquals("OPENAPI", api.getType());
        Assertions.assertEquals(0, api.getLabels().size());
    }

    @Test
    public void testGetApiByIdWithLabels() throws Exception {
        List<LabelDto> labels = new LinkedList<>();
        labels.add(LabelDto.builder().key("label-1").value("value-1").build());
        labels.add(LabelDto.builder().key("label-2").value("value-2").build());
        labels.add(LabelDto.builder().key("label-3").value("value-3").build());
        
        storage.createAPI(NewApiDto.builder()
                .apiId("testGetApiByIdWithLabels")
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .labels(labels)
                .build());
        
        ApiDto api = storage.getApi("testGetApiByIdWithLabels");
        Assertions.assertEquals("testGetApiByIdWithLabels", api.getApiId());
        Assertions.assertEquals(3, api.getLabels().size());
        Assertions.assertTrue(containsLabel(api.getLabels(), "label-1", "value-1"));
        Assertions.assertTrue(containsLabel(api.getLabels(), "label-2", "value-2"));
        Assertions.assertTrue(containsLabel(api.getLabels(), "label-3", "value-3"));
    }

    @Test
    public void testGetApiLabels() throws Exception {
        String apiId = "testGetApiLabels";
        
        List<LabelDto> labels = new LinkedList<>();
        labels.add(LabelDto.builder().key("label-1").value("value-1").build());
        labels.add(LabelDto.builder().key("label-2").value("value-2").build());
        labels.add(LabelDto.builder().key("label-3").value("value-3").build());
        
        storage.createAPI(NewApiDto.builder()
                .apiId(apiId)
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .labels(labels)
                .build());
        
        List<LabelDto> storedLabels = storage.listApiLabels(apiId);
        Assertions.assertTrue(containsLabel(storedLabels, "label-1", "value-1"));
        Assertions.assertTrue(containsLabel(storedLabels, "label-2", "value-2"));
        Assertions.assertTrue(containsLabel(storedLabels, "label-3", "value-3"));
    }

    @Test
    public void testGetApiById_404() throws Exception {
        Assertions.assertThrows(AlhNotFoundException.class, () -> {
            storage.getApi("missing-api");
        });
    }

    @Test
    public void testDeleteApi() throws Exception {
        storage.createAPI(NewApiDto.builder()
                .apiId("testDeleteApi")
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .build());

        storage.getApi("testDeleteApi");

        storage.deleteAPI("testDeleteApi");

        Assertions.assertThrows(AlhNotFoundException.class, () -> {
            storage.getApi("testDeleteApi");
        });
    }

    @Test
    public void testDeleteApiWithLabels() throws Exception {
        List<LabelDto> labels = new LinkedList<>();
        labels.add(LabelDto.builder().key("label-1").value("value-1").build());
        labels.add(LabelDto.builder().key("label-2").value("value-2").build());
        labels.add(LabelDto.builder().key("label-3").value("value-3").build());
        
        storage.createAPI(NewApiDto.builder()
                .apiId("testDeleteApiWithLabels")
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .labels(labels)
                .build());

        storage.getApi("testDeleteApiWithLabels");

        storage.deleteAPI("testDeleteApiWithLabels");

        Assertions.assertThrows(AlhNotFoundException.class, () -> {
            storage.getApi("testDeleteApiWithLabels");
        });
    }

    @Test
    public void testUpdateApi() throws Exception {
        String apiId = "AlhStorageTest_testUpdateApi";
        
        storage.createAPI(NewApiDto.builder()
                .apiId(apiId)
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .description("My test API is here.")
                .build());
        
        ApiDto api = storage.getApi(apiId);
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("My test API is here.", api.getDescription());
        Assertions.assertEquals("application/json", api.getEncoding());
        Assertions.assertEquals("Test API", api.getName());
        Assertions.assertEquals("OPENAPI", api.getType());
        Assertions.assertEquals(0, api.getLabels().size());
        
        storage.updateAPI(apiId, UpdateApiDto.builder()
                .name("New Name API")
                .description("This is a new description.")
                .build());
        
        api = storage.getApi(apiId);
        Assertions.assertEquals(apiId, api.getApiId());
        Assertions.assertEquals("This is a new description.", api.getDescription());
        Assertions.assertEquals("application/json", api.getEncoding());
        Assertions.assertEquals("New Name API", api.getName());
        Assertions.assertEquals("OPENAPI", api.getType());
        Assertions.assertEquals(0, api.getLabels().size());
    }

    @Test
    public void testCreateVersion() throws Exception {
        String apiId = "AlhStorageTest_testCreateVersion";
        
        storage.createAPI(NewApiDto.builder()
                .apiId(apiId)
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .description("My test API is here.")
                .build());
        
        storage.createVersion(apiId, NewVersionDto.builder()
                .version("1.0")
                .description("Version 1.0")
                .build());
    }

    @Test
    public void testDeleteVersion() throws Exception {
        String apiId = "AlhStorageTest_testDeleteVersion";
        
        storage.createAPI(NewApiDto.builder()
                .apiId(apiId)
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .build());
        
        storage.createVersion(apiId, NewVersionDto.builder()
                .version("1.0")
                .description("Version 1.0")
                .build());

        storage.getApi(apiId);
        storage.getVersion(apiId, "1.0");

        storage.deleteVersion(apiId, "1.0");

        Assertions.assertThrows(AlhNotFoundException.class, () -> {
            storage.getVersion(apiId, "1.0");
        });
    }

    @Test
    public void testUpdateVersion() throws Exception {
        String apiId = "AlhStorageTest_testUpdateVersion";
        
        storage.createAPI(NewApiDto.builder()
                .apiId(apiId)
                .type("OPENAPI")
                .encoding("application/json")
                .name("Test API")
                .description("My test API is here.")
                .build());
        
        storage.createVersion(apiId, NewVersionDto.builder()
                .version("1.0")
                .description("Version 1.0")
                .build());

        VersionDto version = storage.getVersion(apiId, "1.0");
        Assertions.assertEquals(apiId, version.getApiId());
        Assertions.assertEquals("1.0", version.getVersion());
        Assertions.assertEquals("Version 1.0", version.getDescription());
        Assertions.assertEquals(0, version.getLabels().size());
        
        storage.updateVersion(apiId, "1.0", UpdateVersionDto.builder()
                .description("Version 1.0 is the best!")
                .build());
        
        version = storage.getVersion(apiId, "1.0");
        Assertions.assertEquals(apiId, version.getApiId());
        Assertions.assertEquals("1.0", version.getVersion());
        Assertions.assertEquals("Version 1.0 is the best!", version.getDescription());
        Assertions.assertEquals(0, version.getLabels().size());
    }

}
