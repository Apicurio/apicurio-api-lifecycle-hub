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

package io.apicurio.lifecycle.rest.v0.impl;

import java.io.InputStream;
import java.math.BigInteger;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;

import io.apicurio.common.apps.content.IoUtil;
import io.apicurio.lifecycle.rest.v0.ApisResource;
import io.apicurio.lifecycle.rest.v0.beans.Api;
import io.apicurio.lifecycle.rest.v0.beans.ApiSearchResults;
import io.apicurio.lifecycle.rest.v0.beans.ApiSortBy;
import io.apicurio.lifecycle.rest.v0.beans.Label;
import io.apicurio.lifecycle.rest.v0.beans.NewApi;
import io.apicurio.lifecycle.rest.v0.beans.NewVersion;
import io.apicurio.lifecycle.rest.v0.beans.SortOrder;
import io.apicurio.lifecycle.rest.v0.beans.UpdateApi;
import io.apicurio.lifecycle.rest.v0.beans.UpdateVersion;
import io.apicurio.lifecycle.rest.v0.beans.Version;
import io.apicurio.lifecycle.rest.v0.beans.VersionSearchResults;
import io.apicurio.lifecycle.rest.v0.beans.VersionSortBy;
import io.apicurio.lifecycle.storage.AlhStorage;
import io.apicurio.lifecycle.storage.dtos.ApiSearchResultsDto;
import io.apicurio.lifecycle.storage.dtos.ToBean;
import io.apicurio.lifecycle.storage.dtos.ToDto;
import io.apicurio.lifecycle.storage.dtos.UpdateVersionContentDto;
import io.apicurio.lifecycle.storage.dtos.VersionContentDto;
import io.apicurio.lifecycle.storage.dtos.VersionSearchResultsDto;
import io.apicurio.lifecycle.workflows.rest.client.LifecycleWorkflowsClient;
import io.apicurio.lifecycle.workflows.rest.client.models.Event;
import io.apicurio.lifecycle.workflows.rest.client.models.EventContext;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Context;
import jakarta.servlet.http.HttpServletRequest;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class ApisResourceImpl implements ApisResource {

    @Inject
    Logger log;
    
    @Inject
    AlhStorage storage;
    
    @Inject
    LifecycleWorkflowsClient workflowsClient;

    @Inject
    @Context
    HttpServletRequest request;

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#getAPI(java.lang.String)
     */
    @Override
    public Api getAPI(String apiId) {
        return ToBean.api(storage.getApi(apiId));
    }

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#updateAPI(java.lang.String, io.apicurio.lifecycle.rest.v0.beans.UpdateApi)
     */
    @Override
    public void updateAPI(String apiId, @NotNull UpdateApi data) {
        storage.updateAPI(apiId, ToDto.updateApi(data));
    }

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#deleteAPI(java.lang.String)
     */
    @Override
    public void deleteAPI(String apiId) {
        storage.deleteAPI(apiId);
    }

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#getAPIS(java.lang.String, java.math.BigInteger, java.math.BigInteger, io.apicurio.lifecycle.rest.v0.beans.SortOrder, io.apicurio.lifecycle.rest.v0.beans.ApiSortBy, java.util.List, java.lang.String)
     */
    @Override
    public ApiSearchResults getAPIS(String name, BigInteger offset, BigInteger limit, SortOrder order,
            ApiSortBy orderby, List<String> labels, String description) {

        if (orderby == null) {
            orderby = ApiSortBy.name;
        }
        if (offset == null) {
            offset = BigInteger.valueOf(0);
        }
        if (limit == null) {
            limit = BigInteger.valueOf(20);
        }
        
        // TODO add filtering
        ApiSearchResultsDto resultsDto = storage.listApis(offset, limit);
        return ToBean.apiSearchResults(resultsDto);
    }

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#createAPI(io.apicurio.lifecycle.rest.v0.beans.NewApi)
     */
    @Override
    public void createAPI(@NotNull NewApi data) {
        storage.createAPI(ToDto.newApi(data));
    }
    
    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#getApiLabels(java.lang.String)
     */
    @Override
    public List<Label> getApiLabels(String apiId) {
        return ToBean.labelList(storage.listApiLabels(apiId));
    }
    
    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#createVersion(java.lang.String, io.apicurio.lifecycle.rest.v0.beans.NewVersion)
     */
    @Override
    public void createVersion(String apiId, @NotNull NewVersion data) {
        // Create the new version in storage
        storage.createVersion(apiId, ToDto.newVersion(data));
        
        // Fire event (trigger workflow)
        Event event = new Event();
        event.setType("version:create");
        event.setId(UUID.randomUUID().toString());
        event.setContext(new EventContext());
        event.getContext().setAdditionalData(Map.of("apiId", apiId, "version", data.getVersion()));
        workflowsClient.events().post(event);
    }
    
    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#updateVersion(java.lang.String, java.lang.String, io.apicurio.lifecycle.rest.v0.beans.UpdateVersion)
     */
    @Override
    public void updateVersion(String apiId, String version, @NotNull UpdateVersion data) {
        storage.updateVersion(apiId, version, ToDto.updateVersion(data));
    }
    
    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#deleteVersion(java.lang.String, java.lang.String)
     */
    @Override
    public void deleteVersion(String apiId, String version) {
        storage.deleteVersion(apiId, version);
    }
    
    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#getVersion(java.lang.String, java.lang.String)
     */
    @Override
    public Version getVersion(String apiId, String version) {
        return ToBean.version(storage.getVersion(apiId, version));
    }
    
    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#getVersions(java.lang.String, java.lang.String, java.math.BigInteger, java.math.BigInteger, io.apicurio.lifecycle.rest.v0.beans.SortOrder, io.apicurio.lifecycle.rest.v0.beans.VersionSortBy, java.util.List)
     */
    @Override
    public VersionSearchResults getVersions(String apiId, String version, BigInteger offset, BigInteger limit,
            SortOrder order, VersionSortBy orderby, List<String> labels) {

        if (orderby == null) {
            orderby = VersionSortBy.createdOn;
        }
        if (offset == null) {
            offset = BigInteger.valueOf(0);
        }
        if (limit == null) {
            limit = BigInteger.valueOf(20);
        }
        
        // TODO add filtering
        VersionSearchResultsDto resultsDto = storage.listVersions(apiId, offset, limit);
        return ToBean.versionSearchResults(resultsDto);
    }

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#getVersionLabels(java.lang.String, java.lang.String)
     */
    @Override
    public List<Label> getVersionLabels(String apiId, String version) {
        return ToBean.labelList(storage.listVersionLabels(apiId, version));
    }
    
    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#getVersionContent(java.lang.String, java.lang.String)
     */
    @Override
    public Response getVersionContent(String apiId, String version) {
        VersionContentDto dto = storage.getVersionContent(apiId, version);
        return Response.ok(dto.getContent(), dto.getContentType()).build();
    }

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#updateTheContentOfAnAPIVersion(java.lang.String, java.lang.String, java.io.InputStream)
     */
    @Override
    public void updateTheContentOfAnAPIVersion(String apiId, String version, @NotNull InputStream data) {
        String content = IoUtil.toString(data);
        storage.updateVersionContent(apiId, version, UpdateVersionContentDto.builder()
                .content(content)
                .contentType(request.getContentType())
                .build());

        // Fire event (send message to workflow)
        Event event = new Event();
        event.setType("version:change");
        event.setId(UUID.randomUUID().toString());
        event.setContext(new EventContext());
        event.getContext().setAdditionalData(Map.of("apiId", apiId, "version", version));
        workflowsClient.events().post(event);
    }

}
