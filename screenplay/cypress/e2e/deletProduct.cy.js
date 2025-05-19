describe('Pruebas E2E para eliminar un producto', () => {
    beforeEach(() => {
        // Configura el rol en el localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('role', 'admin'); // Establece el rol como 'admin'
        });

        // Intercepta la solicitud GET para cargar los detalles del producto
        cy.intercept('GET', '/api/product/1', {
            statusCode: 200,
            body: {
                id: 1,
                name: 'Producto Test',
                description: 'Descripción del producto',
                price: 100,
                stock: 10,
            },
        }).as('getProduct');

        // Navega a la página del producto
        cy.visit('/product/1');
        cy.wait('@getProduct'); // Espera a que se carguen los detalles del producto
    });

    it('Debe eliminar un producto correctamente', () => {
        // Intercepta la solicitud DELETE para eliminar el producto
        cy.intercept('DELETE', '/api/product/1', {
            statusCode: 200,
            body: { message: 'Producto eliminado con éxito' },
        }).as('deleteProduct');

        // Simula el clic en el botón de eliminar
        cy.get('button').contains('Eliminar').click();

        // Simula la confirmación en el modal de SweetAlert2
        cy.get('.swal2-confirm').click();

        // Verifica que la solicitud DELETE fue interceptada y que la respuesta es correcta
        cy.wait('@deleteProduct').then((interception) => {
            expect(interception.response.statusCode).to.eq(200); // Verifica que el código de estado sea 200
            expect(interception.response.body.message).to.eq('Producto eliminado con éxito'); // Verifica el mensaje de respuesta
        });

        // Verifica que el usuario sea redirigido a la lista de productos
        cy.url().should('include', '/product');
    });
});