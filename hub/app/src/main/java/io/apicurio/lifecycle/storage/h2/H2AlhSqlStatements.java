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

package io.apicurio.lifecycle.storage.h2;

import java.sql.SQLException;

import io.apicurio.common.apps.storage.sql.jdbi.query.Update;
import io.apicurio.common.apps.storage.sql.jdbi.query.UpdateImpl;
import io.apicurio.lifecycle.storage.CommonAlhSqlStatements;
import io.quarkus.arc.DefaultBean;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
@DefaultBean
public class H2AlhSqlStatements extends CommonAlhSqlStatements {

    /**
     * @see io.apicurio.common.apps.storage.sql.BaseSqlStatements#dbType()
     */
    @Override
    public String dbType() {
        return "h2";
    }

    /**
     * @see io.apicurio.common.apps.storage.sql.BaseSqlStatements#isPrimaryKeyViolation(java.sql.SQLException)
     */
    @Override
    public boolean isPrimaryKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("primary key violation");   
    }

    /**
     * @see io.apicurio.common.apps.storage.sql.BaseSqlStatements#isForeignKeyViolation(java.sql.SQLException)
     */
    @Override
    public boolean isForeignKeyViolation(SQLException ex) {
        return ex.getMessage() != null && ex.getMessage().contains("Referential integrity constraint violation");
    }

    @Override
    public Update setStorageProperty(String key, String value) {
        var q = new UpdateImpl("""
                MERGE INTO apicurio (pkey, pvalue) KEY(pkey) VALUES (?, ?)\
                """);
        return q.bind(0, key)
                .bind(1, value);
    }

    @Override
    public String getNextSequenceValue() {
        // H2 does not support atomic increment
        throw new UnsupportedOperationException();
    }

    @Override
    public String getSequenceValue() {
        return """
                SELECT s.svalue FROM sequences s \
                WHERE s.skey = ?\
                """;
    }

    @Override
    public String casSequenceValue() {
        return """
                UPDATE sequences s \
                SET svalue = ? \
                WHERE s.skey = ? AND s.svalue = ?\
                """;
    }

    @Override
    public String insertSequenceValue() {
        return """
                INSERT INTO sequences (skey, svalue) \
                VALUES (?, ?, ?)\
                """;
    }
    
}
