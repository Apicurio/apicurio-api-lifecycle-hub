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

package io.apicurio.lifecycle.workflows.rest.v0;

import io.apicurio.lifecycle.workflows.rest.v0.beans.SystemInfo;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class SystemResourceImpl implements SystemResource {
    
    @Inject
    io.apicurio.common.apps.core.System system;

    /**
     * @see io.apicurio.lifecycle.rest.v1.SystemResource#getSystemInfo()
     */
    @Override
    public SystemInfo getSystemInfo() {
        return SystemInfo.builder()
                .name(this.system.getName())
                .description(this.system.getDescription())
                .version(this.system.getVersion())
                .builtOn(this.system.getDate())
                .build();
    }

}
