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

import org.slf4j.Logger;

import io.apicurio.common.apps.logging.LoggerProducer;
import io.apicurio.common.apps.storage.sql.BaseSqlStorageComponent;
import io.apicurio.lifecycle.storage.AbstractAlhStorage;
import io.quarkus.arc.DefaultBean;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
@DefaultBean
public class H2AlhStorage extends AbstractAlhStorage {
    
    @Inject
    Logger log;

    @Inject
    LoggerProducer loggerProducer;

    /**
     * @see io.apicurio.lifecycle.storage.AbstractAlhStorage#init()
     */
    @Override
    @PostConstruct
    @Transactional
    protected void init() {
        log.debug("Initializing the H2 ALH storage.");
        storageEngine.start(loggerProducer, handles, BaseSqlStorageComponent.Configuration.builder()
                .sqlStatements(sqlStatements)
                .supportsAtomicSequenceIncrement(false)
                .ddlDirRootPath("META-INF/storage/schema")
                .build());
    }

}
