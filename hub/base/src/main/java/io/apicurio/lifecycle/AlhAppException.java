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

package io.apicurio.lifecycle;

/**
 * @author eric.wittmann@gmail.com
 */
public class AlhAppException extends RuntimeException {

    private static final long serialVersionUID = -7260750324268131408L;

    public AlhAppException(String message) {
        super(message);
    }

    public AlhAppException(String message, Throwable cause) {
        super(message, cause);
    }
}