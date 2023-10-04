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

import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.sql.jdbi.Handle;

/**
 * @author eric.wittmann@gmail.com
 */
public abstract class CommonAlhSqlStatements implements AlhSqlStatements {

    // ==================== BaseSqlStatements ====================

    @Override
    public boolean isDatabaseInitialized(Handle handle) throws StorageException {
        int count = handle.createQuery("SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'apicurio'")
                .mapTo(Integer.class).one();
        return count > 0;
    }

    @Override
    public String getStorageProperty() {
        return """
                SELECT a."value" FROM apicurio a WHERE a."key" = ?\
                """;
    }
}
