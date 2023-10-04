-- *********************************************************************
-- DDL for the Apicurio API Lifecycle Hub - Database: H2
-- *********************************************************************

CREATE TABLE apicurio ("key" VARCHAR(255) NOT NULL, "value" VARCHAR(255));
ALTER TABLE apicurio ADD PRIMARY KEY ("key");

CREATE TABLE sequences ("key" VARCHAR(32) NOT NULL, "value" BIGINT NOT NULL);
ALTER TABLE sequences ADD PRIMARY KEY ("key");
