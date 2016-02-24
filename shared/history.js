if (process.env.BROWSER) {
    const { createHistory } = require('history');

    module.exports = createHistory();
}
