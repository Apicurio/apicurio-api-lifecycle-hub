#! /usr/bin/env node

const fs = require("fs");

const CONFIG_OUTPUT_PATH=process.env["LIFECYCLE_CONFIG_OUTPUT_PATH"] || "/opt/app-root/src/config.js";

console.info("Generating application config at:", CONFIG_OUTPUT_PATH);

const CONTEXT_PATH=process.env["LIFECYCLE_CONTEXT_PATH"] || "/";
const NAV_PREFIX_PATH=process.env["LIFECYCLE_NAV_PREFIX_PATH"] || "";
const LIFECYCLE_API_URL=process.env["LIFECYCLE_API_URL"] || "/apis/designer/v0";
const SHOW_MASTHEAD=process.env["LIFECYCLE_SHOW_MASTHEAD"] || "true";
const MASTHEAD_LABEL=process.env["LIFECYCLE_MASTHEAD_LABEL"] || "API LIFECYCLE";
const EDITORS_URL=process.env["LIFECYCLE_EDITORS_URL"] || "/editors/";

const AUTH_TYPE=process.env["LIFECYCLE_AUTH_TYPE"] || "none";
const AUTH_URL=process.env["LIFECYCLE_AUTH_URL"] || "";
const AUTH_CLIENT_ID=process.env["LIFECYCLE_AUTH_CLIENT_ID"] || "api-designer-ui";
const AUTH_REDIRECT_URL=process.env["LIFECYCLE_AUTH_REDIRECT_URL"] || "";

// Create the config to output.
const CONFIG = {
    apis: {
        "hub": LIFECYCLE_API_URL
    },
    ui: {
        contextPath: CONTEXT_PATH,
        navPrefixPath: NAV_PREFIX_PATH
    },
    auth: {
        type: AUTH_TYPE,
        options: {
            redirectUri: AUTH_REDIRECT_URL,
            clientId: AUTH_CLIENT_ID,
            url: AUTH_URL
        }
    }
};

const FILE_CONTENT = `
const ApiLifecycleConfig = ${JSON.stringify(CONFIG, null, 4)};
`;

fs.writeFile(CONFIG_OUTPUT_PATH, FILE_CONTENT, "utf8", (err) => {
    if (err) {
      console.error("Error writing config to file:", err);
      return;
    }
    console.log("Config successfully written to file.");
});
