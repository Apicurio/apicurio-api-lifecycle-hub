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

import org.slf4j.Logger;

import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.common.apps.storage.sql.jdbi.HandleFactory;
import jakarta.inject.Inject;

/**
 * @author eric.wittmann@gmail.com
 */
public abstract class AbstractAlhStorage implements AlhStorage {

    @Inject
    Logger log;
    
    @Inject
    protected HandleFactory handles;

    @Inject
    protected AlhSqlStatements sqlStatements;

    @Inject
    protected BaseSqlStorageComponent storageEngine;

    @Inject
    protected StorageExceptionMapper exceptionMapper;

    /**
     * The overriding method MUST be annotated with:
     * \@PostConstruct
     * \@Transactional
     */
    protected abstract void init();
}
