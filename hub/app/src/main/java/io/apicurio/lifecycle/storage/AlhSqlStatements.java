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

import io.apicurio.common.apps.storage.sql.BaseSqlStatements;

/**
 * @author eric.wittmann@gmail.com
 */
public interface AlhSqlStatements extends BaseSqlStatements {

    String selectApiById();

    String selectApiLabelsById();

    String insertApi();

    String deleteApi();

    String insertApiLabel();

    String deleteApiLabels();

    String updateApi();

    String selectApis();

    String insertVersion();

    String insertVersionLabel();

    String selectVersionByApiIdAndVersion();

    String selectVersionLabelsByApiIdAndVersion();

    String updateVersion();

    String deleteVersionLabels();

    String selectVersions();

    String deleteVersion();
    
    String insertVersionContent();

    String selectVersionContentByApiIdAndVersion();

    String updateVersionContent();

    String deleteVersionContent();

}
