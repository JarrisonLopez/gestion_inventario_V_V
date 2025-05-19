const Actor = require('../../actors/actors'); // Ruta correcta para actors.js
const EnterCredentials = require('../../task/enterCredentials'); // Ruta correcta para enterCredentials.js
const ClickLoginButton = require('../../task/clickLoginButton'); // Ruta correcta para clickLoginButton.js
const IsErrorMessageVisible = require('../../questions/isErrorMessageVisible'); // Ruta correcta para isErrorMessageVisible.js
const IsUserRedirected = require('../../questions/isUserRedirected'); // Ruta correcta para isUserRedirected.js
describe('Pruebas E2E de inicio de sesión con Screenplay', () => {
    let actor;

    beforeEach(() => {
        cy.intercept('POST', '/api/login', {
            statusCode: 200,
            body: { message: 'Inicio de sesión exitoso' },
        }).as('loginRequest');
        cy.visit('/login'); // Navega a la página de inicio de sesión
    });

    it('Debe iniciar sesión correctamente con credenciales válidas', () => {
        cy.get('#username').type('admin'); // Ingresa el nombre de usuario
        cy.get('#password').type('admin123'); // Ingresa la contraseña
        cy.get('button[type="submit"]').click(); // Haz clic en el botón de inicio de sesión
    
        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(200); // Verifica que la respuesta sea 200
        });
    
        cy.url().should('include', '/product'); // Verifica que la URL incluya '/product'
    });

    it('Debe mostrar un mensaje de error con credenciales inválidas', async () => {
        await actor.attemptsTo(new EnterCredentials('admin', 'wrongpassword'));
        await actor.attemptsTo(new ClickLoginButton());

        const isErrorVisible = await actor.asks(new IsErrorMessageVisible());
        expect(isErrorVisible).to.be.true;
    });
});