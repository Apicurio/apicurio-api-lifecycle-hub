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

package io.apicurio.lifecycle.rest;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.microsoft.kiota.authentication.AnonymousAuthenticationProvider;
import com.microsoft.kiota.http.OkHttpRequestAdapter;

import io.apicurio.lifecycle.rest.clients.self.LifecycleHubClient;

/**
 * @author eric.wittmann@gmail.com
 */
public abstract class AbstractResourceTest {

    @ConfigProperty(name = "quarkus.http.test-port")
    public int testPort;

    private LifecycleHubClient client;
    
    protected LifecycleHubClient client() {
        if (client == null) {
            String serverUrl = "http://localhost:%s/apis/hub/v0";
            String baseUrl = String.format(serverUrl, testPort);
            
            OkHttpRequestAdapter adapter = new OkHttpRequestAdapter(new AnonymousAuthenticationProvider());
            adapter.setBaseUrl(baseUrl);
            client = new LifecycleHubClient(adapter);
        }
        return client;
    }
    
}
