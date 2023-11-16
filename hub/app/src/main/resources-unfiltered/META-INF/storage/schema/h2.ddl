-- *********************************************************************
-- DDL for the Apicurio API Lifecycle Hub - Database: H2
-- *********************************************************************

CREATE TABLE apicurio (pkey VARCHAR(255) NOT NULL, pvalue VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY (pkey);

CREATE TABLE apis (apiId VARCHAR(128) NOT NULL, type VARCHAR(32) NOT NULL, encoding VARCHAR(64) NOT NULL, owner VARCHAR(128) NOT NULL, createdOn TIMESTAMP WITHOUT TIME ZONE NOT NULL, name VARCHAR(128) NOT NULL, description VARCHAR(512));
ALTER TABLE apis ADD PRIMARY KEY (apiId);
CREATE INDEX IDX_apis_1 ON apis(type);
CREATE INDEX IDX_apis_2 ON apis(encoding);
CREATE HASH INDEX IDX_apis_3 ON apis(owner);
CREATE INDEX IDX_apis_4 ON apis(createdOn);
CREATE INDEX IDX_apis_5 ON apis(name);
CREATE INDEX IDX_apis_6 ON apis(description);

CREATE TABLE apiLabels (apiId VARCHAR(128) NOT NULL, name VARCHAR(128) NOT NULL, lvalue VARCHAR(512));
ALTER TABLE apiLabels ADD CONSTRAINT FK_labels_1 FOREIGN KEY (apiId) REFERENCES apis(apiId);
CREATE INDEX IDX_labels_1 ON apiLabels(name);
CREATE INDEX IDX_labels_2 ON apiLabels(lvalue);

CREATE TABLE sequences (skey VARCHAR(32) NOT NULL, svalue BIGINT NOT NULL);
ALTER TABLE sequences ADD PRIMARY KEY (skey);
