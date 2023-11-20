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

import java.math.BigInteger;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;

import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.exceptions.NotFoundException;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.common.apps.storage.sql.jdbi.HandleFactory;
import io.apicurio.lifecycle.storage.dtos.ApiDto;
import io.apicurio.lifecycle.storage.dtos.ApiSearchResultsDto;
import io.apicurio.lifecycle.storage.dtos.LabelDto;
import io.apicurio.lifecycle.storage.dtos.NewApiDto;
import io.apicurio.lifecycle.storage.dtos.SearchedApiDto;
import io.apicurio.lifecycle.storage.dtos.UpdateApiDto;
import io.apicurio.lifecycle.storage.mappers.ApiDtoMapper;
import io.apicurio.lifecycle.storage.mappers.LabelDtoMapper;
import io.apicurio.lifecycle.storage.mappers.SearchedApiDtoMapper;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class AlhStorage {
    
    private static final String API_ID_KEY = "apiId";

    @Inject
    Logger log;

    @Inject
    LoggerProducer loggerProducer;

    @Inject
    HandleFactory handles;

    @Inject
    AlhSqlStatements sqlStatements;

    @Inject
    BaseSqlStorageComponent storageEngine;

    @Inject
    StorageExceptionMapper exceptionMapper;

    @PostConstruct
    @Transactional
    protected void init() {
        log.debug("Initializing the ALH storage.");
        storageEngine.start(loggerProducer, handles, BaseSqlStorageComponent.Configuration.builder()
                .sqlStatements(sqlStatements)
                .supportsAtomicSequenceIncrement(false)
                .ddlDirRootPath("META-INF/storage/schema")
                .build());
    }

    @Transactional
    public ApiDto getApi(String apiId) {
        log.debug("Selecting a single API: {}", apiId);
        return handles.withHandleNoExceptionMapped(handle -> {
            // Read the API from the apis table
            Optional<ApiDto> res = handle.createQuery(sqlStatements.selectApiById())
                    .bind(0, apiId)
                    .map(ApiDtoMapper.instance)
                    .findOne();
            ApiDto apiDto = res.orElseThrow(() -> {
                return new NotFoundException("No API found with ID: " + apiId, Collections.singletonMap("apiId", apiId));
            });

            // Read any labels the API has from the apiLabels table
            List<LabelDto> labels = handle.createQuery(sqlStatements.selectApiLabelsById())
                    .bind(0, apiId)
                    .map(LabelDtoMapper.instance)
                    .list();
            apiDto.setLabels(labels);
            return apiDto;
        });
    }

    @Transactional
    public void createAPI(NewApiDto newApi) {
        log.debug("Inserting an API row for: {}", newApi.getApiId());
        handles.withHandleNoExceptionMapped(handle -> {
            // Insert the API row
            handle.createUpdate(sqlStatements.insertApi())
                    .bind(0, newApi.getApiId())
                    .bind(1, newApi.getType())
                    .bind(2, newApi.getEncoding())
                    .bind(3, "user")
                    .bind(4, new Date())
                    .bind(5, newApi.getName())
                    .bind(6, newApi.getDescription())
                    .execute();

            // Now insert a row for each label
            if (newApi.getLabels() != null && !newApi.getLabels().isEmpty()) {
                for (LabelDto label : newApi.getLabels()) {
                    handle.createUpdate(sqlStatements.insertApiLabel())
                            .bind(0, newApi.getApiId())
                            .bind(1, label.getName())
                            .bind(2, label.getValue())
                            .execute();
                }
            }
            
            return null;
        });
    }

    @Transactional
    public void deleteAPI(String apiId) {
        log.debug("Deleting an API: {}", apiId);
        handles.withHandleNoExceptionMapped(handle -> {
            // First delete all labels
            handle.createUpdate(sqlStatements.deleteApiLabels())
                .bind(0, apiId)
                .execute();
            
            // Then delete the API
            int rowCount = handle.createUpdate(sqlStatements.deleteApi())
                    .bind(0, apiId)
                    .execute();
            if (rowCount == 0) {
                throw new NotFoundException("No API found with ID: " + apiId, Collections.singletonMap(API_ID_KEY, apiId));
            }
            return null;
        });
    }

    @Transactional
    public void updateAPI(String apiId, UpdateApiDto updateApi) {
        handles.withHandleNoExceptionMapped(handle -> {
            // Update the name and description
            int changed = handle.createUpdate(sqlStatements.updateApi())
                    .setContext(API_ID_KEY, apiId)
                    .bind(0, updateApi.getName())
                    .bind(1, updateApi.getDescription())
                    .bind(2, apiId)
                    .execute();
            if (changed == 0) {
                throw new NotFoundException("No API found with ID: " + apiId, Collections.singletonMap(API_ID_KEY, apiId));
            }
            
            // Now update the labels (delete all existing labels and replace with new)
            handle.createUpdate(sqlStatements.deleteApiLabels())
                    .bind(0, apiId)
                    .execute();
            if (updateApi.getLabels() != null && !updateApi.getLabels().isEmpty()) {
                for (LabelDto label : updateApi.getLabels()) {
                    handle.createUpdate(sqlStatements.insertApiLabel())
                            .bind(0, apiId)
                            .bind(1, label.getName())
                            .bind(2, label.getValue())
                            .execute();
                }
            }
            
            
            return null;
        });        
    }

    public ApiSearchResultsDto listApis(BigInteger offset, BigInteger limit) {
        log.debug("Searching for APIs");
        // TODO implement paging and filtering
        return handles.withHandleNoExceptionMapped(handle -> {
            List<SearchedApiDto> apis = handle.createQuery(sqlStatements.selectApis())
                    .map(SearchedApiDtoMapper.instance)
                    .list();
            
            int count = apis.size();
            
            return ApiSearchResultsDto.builder()
                    .apis(apis)
                    .count(count)
                    .build();
        });
    }

}
