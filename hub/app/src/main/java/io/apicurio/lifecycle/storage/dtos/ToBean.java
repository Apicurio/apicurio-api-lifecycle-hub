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
import java.util.stream.Collectors;

import io.apicurio.lifecycle.rest.v0.beans.Api;
import io.apicurio.lifecycle.rest.v0.beans.ApiSearchResults;
import io.apicurio.lifecycle.rest.v0.beans.ApiType;
import io.apicurio.lifecycle.rest.v0.beans.Label;
import io.apicurio.lifecycle.rest.v0.beans.SearchedApi;
import io.apicurio.lifecycle.rest.v0.beans.SearchedVersion;
import io.apicurio.lifecycle.rest.v0.beans.Version;
import io.apicurio.lifecycle.rest.v0.beans.VersionSearchResults;

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
                rval.put(label.getKey(), label.getValue());
            });
        }
        return rval;
    }

    private static SearchedApi searchedApi(SearchedApiDto dto) {
        return SearchedApi.builder()
                .apiId(dto.getApiId())
                .createdOn(dto.getCreatedOn())
                .description(dto.getDescription())
                .encoding(dto.getEncoding())
                .name(dto.getName())
                .owner(dto.getOwner())
                .type(ApiType.fromValue(dto.getType()))
                .build();
    }

    public static ApiSearchResults apiSearchResults(ApiSearchResultsDto dto) {
        return ApiSearchResults.builder()
                .count(dto.getCount())
                .apis(dto.getApis().stream().map(api -> ToBean.searchedApi(api)).collect(Collectors.toList()))
                .build();
    }
    
    private static Label label(LabelDto dto) {
        return Label.builder()
                .key(dto.getKey())
                .value(dto.getValue())
                .build();
    }

    public static List<Label> labelList(List<LabelDto> dtos) {
        return dtos.stream().map(dto -> label(dto)).collect(Collectors.toList());
    }

    public static Version version(VersionDto dto) {
        return Version.builder()
                .createdOn(dto.getCreatedOn())
                .description(dto.getDescription())
                .modifiedOn(dto.getModifiedOn())
                .version(dto.getVersion())
                .labels(labels(dto.getLabels()))
                .build();
    }

    private static SearchedVersion searchedVersion(SearchedVersionDto dto) {
        return SearchedVersion.builder()
                .version(dto.getVersion())
                .createdOn(dto.getCreatedOn())
                .build();
    }

    public static VersionSearchResults versionSearchResults(VersionSearchResultsDto dto) {
        return VersionSearchResults.builder()
                .count(dto.getCount())
                .versions(dto.getVersions().stream().map(version -> ToBean.searchedVersion(version)).collect(Collectors.toList()))
                .build();
    }

}
