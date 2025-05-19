const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        specPattern: 'screenplay/cypress/e2e/**/*.cy.js', // Incluye todos los archivos .cy.js en e2e
        baseUrl: 'http://localhost:3000', // URL base de tu aplicación
    },
});
