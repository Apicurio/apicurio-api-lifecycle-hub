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

package io.apicurio.lifecycle.storage.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import io.apicurio.common.apps.storage.sql.jdbi.mappers.RowMapper;
import io.apicurio.lifecycle.storage.dtos.SearchedApiDto;

/**
 * @author eric.wittmann@gmail.com
 */
public class SearchedApiDtoMapper implements RowMapper<SearchedApiDto> {
    
    public static final SearchedApiDtoMapper instance = new SearchedApiDtoMapper();

    @Override
    public boolean supports(Class<?> klass) {
        return SearchedApiDto.class.equals(klass);
    }

    @Override
    public SearchedApiDto map(ResultSet rs) throws SQLException {
        return SearchedApiDto.builder()
                .apiId(rs.getString("apiId"))
                .type(rs.getString("type"))
                .encoding(rs.getString("encoding"))
                .name(rs.getString("name"))
                .description(rs.getString("description"))
                .owner(rs.getString("owner"))
                .createdOn(rs.getDate("createdOn"))
                .build();
    }
}