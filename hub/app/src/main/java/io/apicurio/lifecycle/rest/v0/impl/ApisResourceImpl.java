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

import java.math.BigInteger;
import java.util.List;

import org.slf4j.Logger;

import io.apicurio.lifecycle.rest.v0.ApisResource;
import io.apicurio.lifecycle.rest.v0.beans.Api;
import io.apicurio.lifecycle.rest.v0.beans.ApiSearchResults;
import io.apicurio.lifecycle.rest.v0.beans.ApiSortBy;
import io.apicurio.lifecycle.rest.v0.beans.NewApi;
import io.apicurio.lifecycle.rest.v0.beans.SortOrder;
import io.apicurio.lifecycle.rest.v0.beans.UpdateApi;
import io.apicurio.lifecycle.storage.AlhStorage;
import io.apicurio.lifecycle.storage.dtos.ToBean;
import io.apicurio.lifecycle.storage.dtos.ToDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class ApisResourceImpl implements ApisResource {

    @Inject
    Logger log;
    
    @Inject
    AlhStorage storage;

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
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * @see io.apicurio.lifecycle.rest.v0.ApisResource#createAPI(io.apicurio.lifecycle.rest.v0.beans.NewApi)
     */
    @Override
    public void createAPI(@NotNull NewApi data) {
        storage.createAPI(ToDto.newApi(data));
    }

}
