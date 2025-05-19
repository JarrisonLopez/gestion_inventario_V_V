const { Builder } = require('selenium-webdriver');

async function getDriver() {
    // Configura el WebDriver para Chrome
    const driver = await new Builder().forBrowser('chrome').build();
    return driver;
}

module.exports = { getDriver };