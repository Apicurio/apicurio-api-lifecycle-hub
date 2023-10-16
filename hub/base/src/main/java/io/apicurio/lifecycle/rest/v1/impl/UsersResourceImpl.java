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

package io.apicurio.lifecycle.rest.v1.impl;

import io.apicurio.lifecycle.rest.v1.UsersResource;
import io.apicurio.lifecycle.rest.v1.beans.UserInfo;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * @author eric.wittmann@gmail.com
 */
@ApplicationScoped
public class UsersResourceImpl implements UsersResource {

    /**
     * @see io.apicurio.lifecycle.rest.v1.UsersResource#getCurrentUserInfo()
     */
    @Override
    public UserInfo getCurrentUserInfo() {
        // TODO Auto-generated method stub
        return null;
    }

}