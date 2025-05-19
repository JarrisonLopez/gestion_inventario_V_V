describe('Pruebas E2E para no permitir eliminar un producto inexistente', () => {
    beforeEach(() => {
        // Configura el rol en el localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('role', 'admin'); // Establece el rol como 'admin'
        });

        // Intercepta la solicitud GET para cargar los detalles del producto inexistente
        cy.intercept('GET', '/api/product/99999', {
            statusCode: 404,
            body: { message: 'Producto no encontrado' },
        }).as('getNonExistentProduct');

        // Navega a la página del producto inexistente
        cy.visit('/product/99999', { failOnStatusCode: false });
        cy.wait('@getNonExistentProduct'); // Espera a que se cargue la respuesta de la API
    });

    it('Debe mostrar un mensaje de error al intentar eliminar un producto inexistente', () => {
        // Intercepta la solicitud DELETE para intentar eliminar el producto inexistente
        cy.intercept('DELETE', '/api/product/99999', {
            statusCode: 404,
            body: { message: 'Producto no encontrado' },
        }).as('deleteNonExistentProduct');

        // Simula el clic en el botón de eliminar (si está presente)
        cy.get('button').contains('Eliminar').click();

        // Simula la confirmación en el modal de SweetAlert2
        cy.get('.swal2-confirm').click();

        // Verifica que la solicitud DELETE fue interceptada y que la respuesta es un error 404
        cy.wait('@deleteNonExistentProduct').then((interception) => {
            expect(interception.response.statusCode).to.eq(404); // Verifica que el código de estado sea 404
            expect(interception.response.body.message).to.eq('Producto no encontrado'); // Verifica el mensaje de error
        });

        // Verifica que el mensaje de error se muestre en la interfaz
        cy.contains('Producto no encontrado').should('be.visible');
    });
});