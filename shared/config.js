/*
    eslint
        import/no-commonjs: 0
*/

if (process.env.BROWSER) {
    module.exports = window.__CONFIG__;
} else {
    module.exports = require('../etc/client-config.json');
}
