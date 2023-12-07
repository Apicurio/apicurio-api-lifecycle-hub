-- *********************************************************************
-- DDL for the Apicurio API Lifecycle Hub - Database: H2
-- *********************************************************************

CREATE TABLE apicurio (pkey VARCHAR(255) NOT NULL, pvalue VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY (pkey);

CREATE TABLE sequences (skey VARCHAR(32) NOT NULL, svalue BIGINT NOT NULL);
ALTER TABLE sequences ADD PRIMARY KEY (skey);

CREATE TABLE apis (apiId VARCHAR(128) NOT NULL, type VARCHAR(32) NOT NULL, owner VARCHAR(128) NOT NULL, createdOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, name VARCHAR(128) NOT NULL, description VARCHAR(512));
ALTER TABLE apis ADD PRIMARY KEY (apiId);
CREATE INDEX IDX_apis_1 ON apis(type);
CREATE HASH INDEX IDX_apis_2 ON apis(owner);
CREATE INDEX IDX_apis_3 ON apis(createdOn);
CREATE INDEX IDX_apis_4 ON apis(name);
CREATE INDEX IDX_apis_5 ON apis(description);

CREATE TABLE apiLabels (apiId VARCHAR(128) NOT NULL, labelKey VARCHAR(128) NOT NULL, labelValue VARCHAR(512));
ALTER TABLE apiLabels ADD CONSTRAINT FK_labels_1 FOREIGN KEY (apiId) REFERENCES apis(apiId);
CREATE INDEX IDX_labels_1 ON apiLabels(labelKey);
CREATE INDEX IDX_labels_2 ON apiLabels(labelValue);

CREATE TABLE versions (apiId VARCHAR(128) NOT NULL, version VARCHAR(128) NOT NULL, createdOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, modifiedOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, description VARCHAR(512));
ALTER TABLE versions ADD PRIMARY KEY (apiId, version);
ALTER TABLE versions ADD CONSTRAINT FK_versions_1 FOREIGN KEY (apiId) REFERENCES apis(apiId);
CREATE INDEX IDX_versions_1 ON versions(createdOn);
CREATE INDEX IDX_versions_2 ON versions(description);

CREATE TABLE versionLabels (apiId VARCHAR(128) NOT NULL, version VARCHAR(128) NOT NULL, labelKey VARCHAR(128) NOT NULL, labelValue VARCHAR(512));
ALTER TABLE versionLabels ADD CONSTRAINT FK_vlabels_1 FOREIGN KEY (apiId, version) REFERENCES versions(apiId, version);
CREATE INDEX IDX_vlabels_1 ON versionLabels(labelKey);
CREATE INDEX IDX_vlabels_2 ON versionLabels(labelValue);

CREATE TABLE content (apiId VARCHAR(128) NOT NULL, version VARCHAR(128) NOT NULL, contentType VARCHAR(128) NOT NULL, content BYTEA NOT NULL);
ALTER TABLE content ADD PRIMARY KEY (apiId, version);
ALTER TABLE content ADD CONSTRAINT FK_content_1 FOREIGN KEY (apiId, version) REFERENCES versions(apiId, version);
