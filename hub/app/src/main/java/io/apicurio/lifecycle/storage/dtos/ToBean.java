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

package io.apicurio.lifecycle.storage.dtos;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.apicurio.lifecycle.rest.v0.beans.Api;
import io.apicurio.lifecycle.rest.v0.beans.ApiType;

/**
 * @author eric.wittmann@gmail.com
 */
public class ToBean {

    public static Api api(ApiDto dto) {
        return Api.builder()
                .apiId(dto.getApiId())
                .createdOn(dto.getCreatedOn())
                .description(dto.getDescription())
                .encoding(dto.getEncoding())
                .name(dto.getName())
                .owner(dto.getOwner())
                .type(ApiType.fromValue(dto.getType()))
                .labels(labels(dto.getLabels()))
                .build();
    }

    public static Map<String, String> labels(List<LabelDto> dtos) {
        final Map<String, String> rval = new HashMap<>();
        if (dtos != null) {
            dtos.forEach(label -> {
                rval.put(label.getName(), label.getValue());
            });
        }
        return rval;
    }

}
