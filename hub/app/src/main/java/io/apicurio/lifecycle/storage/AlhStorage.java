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
import java.util.Map;
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
import io.apicurio.lifecycle.storage.dtos.NewVersionDto;
import io.apicurio.lifecycle.storage.dtos.SearchedApiDto;
import io.apicurio.lifecycle.storage.dtos.SearchedVersionDto;
import io.apicurio.lifecycle.storage.dtos.UpdateApiDto;
import io.apicurio.lifecycle.storage.dtos.UpdateVersionDto;
import io.apicurio.lifecycle.storage.dtos.VersionDto;
import io.apicurio.lifecycle.storage.dtos.VersionSearchResultsDto;
import io.apicurio.lifecycle.storage.mappers.ApiDtoMapper;
import io.apicurio.lifecycle.storage.mappers.LabelDtoMapper;
import io.apicurio.lifecycle.storage.mappers.SearchedApiDtoMapper;
import io.apicurio.lifecycle.storage.mappers.SearchedVersionDtoMapper;
import io.apicurio.lifecycle.storage.mappers.VersionDtoMapper;
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
    private static final String VERSION_KEY = "version";

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
                            .bind(1, label.getKey())
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
                            .bind(1, label.getKey())
                            .bind(2, label.getValue())
                            .execute();
                }
            }
            
            
            return null;
        });        
    }

    @Transactional
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

    @Transactional
    public List<LabelDto> listApiLabels(String apiId) {
        log.debug("Searching for API labels");
        return handles.withHandleNoExceptionMapped(handle -> {
            List<LabelDto> labels = handle.createQuery(sqlStatements.selectApiLabelsById())
                    .bind(0, apiId)
                    .map(LabelDtoMapper.instance)
                    .list();
            return labels;
        });
    }

    @Transactional
    public void createVersion(String apiId, NewVersionDto newVersion) {
        log.debug("Inserting an API Version row for: {}@{}", apiId, newVersion.getVersion());
        handles.withHandleNoExceptionMapped(handle -> {
            // Insert the API row
            handle.createUpdate(sqlStatements.insertVersion())
                    .bind(0, apiId)
                    .bind(1, newVersion.getVersion())
                    .bind(2, new Date())
                    .bind(3, new Date())
                    .bind(4, newVersion.getDescription())
                    .execute();

            // Now insert a row for each label
            if (newVersion.getLabels() != null && !newVersion.getLabels().isEmpty()) {
                for (LabelDto label : newVersion.getLabels()) {
                    handle.createUpdate(sqlStatements.insertVersionLabel())
                            .bind(0, apiId)
                            .bind(1, newVersion.getVersion())
                            .bind(2, label.getKey())
                            .bind(3, label.getValue())
                            .execute();
                }
            }
            
            return null;
        });
    }

    @Transactional
    public VersionDto getVersion(String apiId, String version) {
        log.debug("Selecting a single API version: {}@{}", apiId, version);
        return handles.withHandleNoExceptionMapped(handle -> {
            // Read the Version from the versions table
            Optional<VersionDto> res = handle.createQuery(sqlStatements.selectVersionByApiIdAndVersion())
                    .bind(0, apiId)
                    .bind(1, version)
                    .map(VersionDtoMapper.instance)
                    .findOne();
            VersionDto dto = res.orElseThrow(() -> {
                return new NotFoundException("No API found with ID: " + apiId, Collections.singletonMap("apiId", apiId));
            });

            // Read any labels the Version has from the versionLabels table
            List<LabelDto> labels = handle.createQuery(sqlStatements.selectVersionLabelsByApiIdAndVersion())
                    .bind(0, apiId)
                    .bind(1, version)
                    .map(LabelDtoMapper.instance)
                    .list();
            dto.setLabels(labels);
            return dto;
        });
    }

    @Transactional
    public void deleteVersion(String apiId, String version) {
        log.debug("Deleting a Version: {}@{}", apiId, version);
        handles.withHandleNoExceptionMapped(handle -> {
            // First delete all labels
            handle.createUpdate(sqlStatements.deleteVersionLabels())
                .bind(0, apiId)
                .bind(1, version)
                .execute();
            
            // Then delete the Version
            int rowCount = handle.createUpdate(sqlStatements.deleteVersion())
                    .bind(0, apiId)
                    .bind(1, version)
                    .execute();
            if (rowCount == 0) {
                throw new NotFoundException("No Version found: " + apiId + "@" + version, 
                        Map.of(API_ID_KEY, apiId, VERSION_KEY, version));
            }
            return null;
        });
    }

    @Transactional
    public void updateVersion(String apiId, String version, UpdateVersionDto updateVersion) {
        handles.withHandleNoExceptionMapped(handle -> {
            // Update the description
            int changed = handle.createUpdate(sqlStatements.updateVersion())
                    .setContext(API_ID_KEY, apiId)
                    .setContext(VERSION_KEY, version)
                    .bind(0, updateVersion.getDescription())
                    .bind(1, apiId)
                    .bind(2, version)
                    .execute();
            if (changed == 0) {
                throw new NotFoundException("No Version found: " + apiId + "@" + version, 
                        Map.of(API_ID_KEY, apiId, VERSION_KEY, version));
            }
            
            // Now update the labels (delete all existing labels and replace with new)
            handle.createUpdate(sqlStatements.deleteVersionLabels())
                    .bind(0, apiId)
                    .bind(1, version)
                    .execute();
            if (updateVersion.getLabels() != null && !updateVersion.getLabels().isEmpty()) {
                for (LabelDto label : updateVersion.getLabels()) {
                    handle.createUpdate(sqlStatements.insertVersionLabel())
                            .bind(0, apiId)
                            .bind(1, version)
                            .bind(2, label.getKey())
                            .bind(3, label.getValue())
                            .execute();
                }
            }
            
            
            return null;
        });        
    }

    @Transactional
    public VersionSearchResultsDto listVersions(String apiId, BigInteger offset, BigInteger limit) {
        log.debug("Searching for Versions");
        // TODO implement paging and filtering
        return handles.withHandleNoExceptionMapped(handle -> {
            List<SearchedVersionDto> versions = handle.createQuery(sqlStatements.selectVersions())
                    .bind(0, apiId)
                    .map(SearchedVersionDtoMapper.instance)
                    .list();
            
            int count = versions.size();
            
            return VersionSearchResultsDto.builder()
                    .versions(versions)
                    .count(count)
                    .build();
        });
    }

    @Transactional
    public List<LabelDto> listVersionLabels(String apiId, String version) {
        log.debug("Searching for Version labels");
        return handles.withHandleNoExceptionMapped(handle -> {
            List<LabelDto> labels = handle.createQuery(sqlStatements.selectVersionLabelsByApiIdAndVersion())
                    .bind(0, apiId)
                    .bind(1, version)
                    .map(LabelDtoMapper.instance)
                    .list();
            return labels;
        });
    }

    
}
