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
import io.apicurio.lifecycle.storage.dtos.VersionContentDto;

/**
 * @author eric.wittmann@gmail.com
 */
public class VersionContentDtoMapper implements RowMapper<VersionContentDto> {
    
    public static final VersionContentDtoMapper instance = new VersionContentDtoMapper();

    @Override
    public boolean supports(Class<?> klass) {
        return VersionContentDto.class.equals(klass);
    }

    @Override
    public VersionContentDto map(ResultSet rs) throws SQLException {
        return VersionContentDto.builder()
                .apiId(rs.getString("apiId"))
                .version(rs.getString("version"))
                .contentType(rs.getString("contentType"))
                .content(rs.getString("content"))
                .build();
    }
}