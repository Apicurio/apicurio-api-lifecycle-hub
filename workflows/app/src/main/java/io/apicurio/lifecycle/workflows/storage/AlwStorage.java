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

package io.apicurio.lifecycle.workflows.storage;

import org.slf4j.Logger;

import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.common.apps.storage.sql.jdbi.HandleFactory;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class AlwStorage {

    @Inject
    Logger log;

    @Inject
    LoggerProducer loggerProducer;

    @Inject
    HandleFactory handles;

    @Inject
    AlwSqlStatements sqlStatements;

    @Inject
    BaseSqlStorageComponent storageEngine;

    @Inject
    StorageExceptionMapper exceptionMapper;

    @PostConstruct
    @Transactional
    protected void init() {
        log.debug("Initializing the ALW storage.");
        storageEngine.start(loggerProducer, handles, BaseSqlStorageComponent.Configuration.builder()
                .sqlStatements(sqlStatements)
                .supportsAtomicSequenceIncrement(false)
                .ddlDirRootPath("META-INF/storage/schema")
                .build());
    }

}
