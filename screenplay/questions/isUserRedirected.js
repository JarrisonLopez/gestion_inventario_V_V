// filepath: screenplay/questions/isUserRedirected.js
class IsUserRedirected {
    async answeredBy(actor) {
        return cy.url().then((currentUrl) => {
            return currentUrl.includes('/product'); // Ajusta '/product' según la URL esperada
        });
    }
}

module.exports = IsUserRedirected;