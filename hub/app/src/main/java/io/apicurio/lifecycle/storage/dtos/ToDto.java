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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import io.apicurio.lifecycle.rest.v0.beans.NewApi;
import io.apicurio.lifecycle.rest.v0.beans.UpdateApi;
import jakarta.validation.constraints.NotNull;

/**
 * @author eric.wittmann@gmail.com
 */
public class ToDto {

    public static NewApiDto newApi(@NotNull NewApi bean) {
        return NewApiDto.builder()
                .apiId(bean.getApiId())
                .description(bean.getDescription())
                .encoding(bean.getEncoding())
                .name(bean.getName())
                .type(bean.getType())
                .labels(labels(bean.getLabels()))
                .build();
    }

    private static List<LabelDto> labels(Map<String, String> labels) {
        if (labels == null) {
            return Collections.emptyList();
        }
        List<LabelDto> dtos = new ArrayList<>(labels.size());
        labels.forEach((k,v) -> {
            dtos.add(LabelDto.builder().name(k).value(v).build());
        });
        return dtos;
    }
    
    public static UpdateApiDto updateApi(@NotNull UpdateApi bean) {
        return UpdateApiDto.builder()
                .description(bean.getDescription())
                .name(bean.getName())
                .labels(labels(bean.getLabels()))
                .build();
    }

}
