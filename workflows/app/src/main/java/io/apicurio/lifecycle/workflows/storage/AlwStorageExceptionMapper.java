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

import java.util.Map;
import java.util.Optional;

import io.apicurio.common.apps.storage.exceptions.AlreadyExistsException;
import io.apicurio.common.apps.storage.exceptions.NotFoundException;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.lifecycle.workflows.AlwAppException;
import io.apicurio.lifecycle.workflows.storage.exceptions.AlwAlreadyExistsException;
import io.apicurio.lifecycle.workflows.storage.exceptions.AlwNotFoundException;
import io.apicurio.lifecycle.workflows.storage.exceptions.AlwStorageException;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
@SuppressWarnings("unchecked")
public class AlwStorageExceptionMapper implements StorageExceptionMapper {

    private static String contextValue(Optional<Map<String, String>> context, String key) {
        if (context == null) {
            return null;
        }
        Map<String, String> map = context.get();
        if (map == null) {
            return null;
        }
        return map.get(key);
    }

    @Override
    public AlwAppException map(StorageException original) {
        if (original instanceof NotFoundException) {
            return notFound((NotFoundException) original);
        }
        if (original instanceof AlreadyExistsException) {
            return alreadyExists((AlreadyExistsException) original);
        }
        return new AlwStorageException(original.getMessage(), original);
    }

    private AlwAppException alreadyExists(AlreadyExistsException original) {
        String apiId = contextValue(original.getContext(), "apiId");
        if (apiId != null) {
            return new AlwAlreadyExistsException("API with id '" + apiId + "' already exists.", original);
        }
        return new AlwAlreadyExistsException("Already exists.", original);
    }

    private AlwAppException notFound(NotFoundException original) {
        String apiId = contextValue(original.getContext(), "apiId");
        if (apiId != null) {
            return new AlwNotFoundException("No API found with id: " + apiId, original);
        }
        return new AlwNotFoundException("Not found.", original);
    }
    
}
