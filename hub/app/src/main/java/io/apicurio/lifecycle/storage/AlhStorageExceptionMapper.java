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

import java.util.Map;
import java.util.Optional;

import io.apicurio.common.apps.storage.exceptions.AlreadyExistsException;
import io.apicurio.common.apps.storage.exceptions.NotFoundException;
import io.apicurio.common.apps.storage.exceptions.StorageException;
import io.apicurio.common.apps.storage.exceptions.StorageExceptionMapper;
import io.apicurio.lifecycle.AlhAppException;
import io.apicurio.lifecycle.storage.exceptions.AlhAlreadyExistsException;
import io.apicurio.lifecycle.storage.exceptions.AlhNotFoundException;
import io.apicurio.lifecycle.storage.exceptions.AlhStorageException;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
@SuppressWarnings("unchecked")
public class AlhStorageExceptionMapper implements StorageExceptionMapper {

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
    public AlhAppException map(StorageException original) {
        if (original instanceof NotFoundException) {
            return notFound((NotFoundException) original);
        }
        if (original instanceof AlreadyExistsException) {
            return alreadyExists((AlreadyExistsException) original);
        }
        return new AlhStorageException(original.getMessage(), original);
    }

    private AlhAppException alreadyExists(AlreadyExistsException original) {
        String apiId = contextValue(original.getContext(), "apiId");
        if (apiId != null) {
            return new AlhAlreadyExistsException("API with id '" + apiId + "' already exists.", original);
        }
        return new AlhAlreadyExistsException("Already exists.", original);
    }

    private AlhAppException notFound(NotFoundException original) {
        String apiId = contextValue(original.getContext(), "apiId");
        if (apiId != null) {
            return new AlhNotFoundException("No API found with id: " + apiId, original);
        }
        return new AlhNotFoundException("Not found.", original);
    }
    
}
