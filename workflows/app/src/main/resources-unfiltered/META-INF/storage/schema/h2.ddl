-- *********************************************************************
-- DDL for the Apicurio API Lifecycle Workflows - Database: H2
-- *********************************************************************

CREATE TABLE apicurio (pkey VARCHAR(255) NOT NULL, pvalue VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY (pkey);

CREATE TABLE sequences (skey VARCHAR(32) NOT NULL, svalue BIGINT NOT NULL);
ALTER TABLE sequences ADD PRIMARY KEY (skey);
