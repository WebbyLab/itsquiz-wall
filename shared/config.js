/*
    eslint
        import/no-commonjs: 0
        import/no-unresolved: 0
*/

if (process.env.BROWSER) {
    module.exports = window.__CONFIG__;
} else {
    const confme = require('confme');

    module.exports = confme(
    `${__dirname}/../etc/client-config.json`,
    `${__dirname}/../etc/client-config-schema.json`
  );
}
