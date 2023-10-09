// index.js
const DEFAULT_RULESET = process.env.DEFAULT_RULESET || "openapi";
const RULESETS = ["openapi", "asyncapi"];

const fs = require("fs");
const path = require("path");
const spectralRuntime = require("@stoplight/spectral-runtime");
const { fetch } = spectralRuntime;

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const spectralCore = require("@stoplight/spectral-core");
const { Spectral, Document } = spectralCore;
const Parsers = require("@stoplight/spectral-parsers");
const { bundleAndLoadRuleset } = require("@stoplight/spectral-ruleset-bundler/with-loader");

const RULESET_CACHE = {};

function loadRuleset(rulesetId) {
  const dirname = process.cwd();
  const rulesetPath = `${dirname}/rulesets/${rulesetId}/.spectral.json`;

  console.log("Loading ruleset from: ", rulesetPath);

  // The contents of the file are stored in the "data" variable
  bundleAndLoadRuleset(rulesetPath, { fs, fetch }).then(ruleset => {
    console.log(`Loaded ruleset ${rulesetId}`);
    RULESET_CACHE[rulesetId] = ruleset;
  });
}

RULESETS.forEach(rsId => {
  loadRuleset(rsId);
});

/**
 * Gets a ruleset object for a given ID.
 * @param rulesetId
 * @returns {undefined|*}
 */
function getRuleset(rulesetId) {
  if (RULESET_CACHE[rulesetId]) {
    return RULESET_CACHE[rulesetId];
  }
  return undefined;
}

// Treat all inputs as Text and limit to 1MB.
const options = {
  type: "*/*",
  limit: 1048576
};
app.use(express.text(options));
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});


// Validation API route
app.post("/validate", (req, res) => {
  const body = req.body;

  // What ruleset to use?  Default is OpenAPI.
  // TODO: default ruleset could change based on the type of document being validated.
  const rulesetId = req.query.ruleset ? req.query.ruleset : DEFAULT_RULESET;

  // Figure out what kind of thing we're validating.
  const type = req.header("content-type");
  const parser = type.toLowerCase().includes("yaml") ? Parsers.Yaml : Parsers.Json;

  // Parse it and create a Document for linting.
  const myDocument = new Document(body, parser, "/file");

  // Load the ruleset to use for validation.
  const ruleset = getRuleset(rulesetId);
  if (rulesetId === undefined) {
    res.status(404).send(`Ruleset '${rulesetId}' not found.`);
    return;
  }
  console.log(`Applying ruleset ${rulesetId}:`);
  console.log(typeof ruleset);

  // Use spectral to lint the given content with the given ruleset.
  const spectral = new Spectral();
  spectral.setRuleset(ruleset);
  spectral.run(myDocument).then(
      result => {
        res.status("200").json(result);
      }
  ).catch(err => {
    res.status(500).send(`Error applying ruleset ${rulesetId}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

