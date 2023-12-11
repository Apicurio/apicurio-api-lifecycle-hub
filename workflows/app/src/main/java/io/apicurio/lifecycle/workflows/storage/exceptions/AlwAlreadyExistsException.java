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

package io.apicurio.lifecycle.workflows.storage.exceptions;

/**
 * @author eric.wittmann@gmail.com
 */
public class AlwAlreadyExistsException extends AlwStorageException {

    private static final long serialVersionUID = 7987639319907017464L;

    public AlwAlreadyExistsException(String reason, Throwable cause) {
        super(reason, cause);
    }

    public AlwAlreadyExistsException(String reason) {
        super(reason);
    }
}