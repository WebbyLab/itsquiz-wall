/* eslint-disable */
const minstache = require("minstache");
const fs = require("fs");
const LIVR = require("livr");
LIVR.Validator.defaultAutoTrim(true);

require("dotenv-defaults").config();

module.exports = function(configPath, livrSchemaPath) {
  const template = fs.readFileSync(configPath).toString();

  // TODO: apply minstache to each field separately
  const configStr = minstache(template, process.env);
  const config = JSON.parse(configStr);

  const livrRules = JSON.parse(fs.readFileSync(livrSchemaPath).toString());
  const validator = new LIVR.Validator(livrRules);

  const validatedConfig = validator.validate(config);

  if (!validatedConfig) {
    throw JSON.stringify(validator.getErrors(), null, 2);
  }

  return validatedConfig;
};
