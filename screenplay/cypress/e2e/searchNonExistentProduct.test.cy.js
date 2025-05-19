describe('Pruebas E2E de producto no encontrado', () => {
    beforeEach(() => {
        // Configura el rol en el localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('role', 'admin'); // Establece el rol como 'admin'
        });
    });

    it('Debe mostrar un mensaje de error al intentar acceder a un producto que no existe', () => {
        // Intercepta la solicitud GET para un producto inexistente
        cy.intercept('GET', '/api/product/99999', {
            statusCode: 404,
            body: { message: 'Producto no encontrado' },
        }).as('getProduct');

        // Navega a la página del producto inexistente
        cy.visit('/product/99999');

        // Verifica que la solicitud GET fue interceptada y que la respuesta es un error 404
        cy.wait('@getProduct').then((interception) => {
            expect(interception.response.statusCode).to.eq(404); // Verifica que el código de estado sea 404
        });

        // Verifica que el mensaje de error se muestre en la interfaz
        cy.contains('Producto no encontrado').should('be.visible');

        // Verifica que el botón "Atrás" esté presente y funcional
        cy.get('a').contains('Atrás').should('be.visible').click();

        // Verifica que el usuario sea redirigido a la lista de productos
        cy.url().should('include', '/product');
    });
});