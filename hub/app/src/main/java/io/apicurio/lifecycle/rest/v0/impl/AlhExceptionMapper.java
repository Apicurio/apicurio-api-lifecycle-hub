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

package io.apicurio.lifecycle.rest.v0.impl;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;

import com.fasterxml.jackson.core.JsonParseException;

import io.apicurio.lifecycle.AlhAppException;
import io.apicurio.lifecycle.storage.exceptions.AlhAlreadyExistsException;
import io.apicurio.lifecycle.storage.exceptions.AlhNotFoundException;
import io.quarkus.runtime.configuration.ConfigUtils;
import io.undertow.util.BadRequestException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import static java.net.HttpURLConnection.*;
import static java.util.Optional.empty;
import static java.util.Optional.of;
import static java.util.UUID.randomUUID;

/**
 * @author eric.wittmann@gmail.com
 */

@ApplicationScoped
@Provider
public class AlhExceptionMapper implements ExceptionMapper<Throwable> {

    @Inject
    Logger log;

    private static final Map<Class<? extends Exception>, Integer> CODE_MAP;

    private final Set<String> quarkusProfiles;

    {
        quarkusProfiles = new HashSet<>();
        quarkusProfiles.addAll(ConfigUtils.getProfiles());
    }

    static {
        // NOTE: Subclasses of the entry will be matched as well.
        // Make sure that if a more specific exception requires a different error code,
        // it is inserted first.
        Map<Class<? extends Exception>, Integer> map = new LinkedHashMap<>();

        map.put(JsonParseException.class, HTTP_BAD_REQUEST);
        map.put(BadRequestException.class, HTTP_BAD_REQUEST); // TODO Maybe use ValidationException?
        map.put(ValidationException.class, HTTP_BAD_REQUEST);

        map.put(AlhNotFoundException.class, HTTP_NOT_FOUND);
        map.put(AlhAlreadyExistsException.class, HTTP_CONFLICT);
        map.put(AlhAppException.class, HTTP_INTERNAL_ERROR);

        CODE_MAP = Collections.unmodifiableMap(map);
    }

    @Override
    public Response toResponse(Throwable exception) {

        Response.ResponseBuilder responseBuilder;

        var httpCode = HTTP_INTERNAL_ERROR;
        if (exception instanceof WebApplicationException) {
            WebApplicationException wae = (WebApplicationException) exception;
            Response response = wae.getResponse();
            httpCode = response.getStatus();
            responseBuilder = Response.fromResponse(response);
        } else {
            // Test for subclasses
            Optional<Integer> code = empty();
            for (Map.Entry<Class<? extends Exception>, Integer> entry : CODE_MAP.entrySet()) {
                if (entry.getKey().isAssignableFrom(exception.getClass())) {
                    code = of(entry.getValue());
                    break;
                }
            }
            httpCode = code.orElse(HTTP_INTERNAL_ERROR);
            responseBuilder = Response.status(httpCode);
        }

        if (httpCode == HTTP_INTERNAL_ERROR) {
            log.warn("Got an unknown exception (no exception mapping has been defined)", exception);
        }

        var errorBuilder = io.apicurio.lifecycle.rest.v0.beans.Error.builder()
                .id(randomUUID().toString())// TODO: Replace with Operation ID so it can be paired with the logs
                .kind("Error")
                .code(String.valueOf(httpCode));

        if (!quarkusProfiles.contains("prod")) {
            var extendedReason = exception.getMessage();
            extendedReason += ". Details:\n";
            extendedReason += exception.getClass().getCanonicalName() + ": " + exception.getMessage() + "\n";

            StringWriter sw = new StringWriter(); // No need to close
            PrintWriter pw = new PrintWriter(sw); // No need to close
            exception.printStackTrace(pw);
            extendedReason += "Stack Trace:\n" + sw;

            errorBuilder.reason(extendedReason);
        } else {
            errorBuilder.reason(exception.getMessage());
        }

        return responseBuilder.type(MediaType.APPLICATION_JSON)
                .entity(errorBuilder.build())
                .build();
    }
}
