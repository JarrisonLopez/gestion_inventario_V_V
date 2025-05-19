describe('Pruebas E2E para actualizar un producto', () => {
    beforeEach(() => {
        // Configura el rol en el localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('role', 'admin'); // Establece el rol como 'admin'
        });

        // Intercepta la solicitud GET para cargar el producto
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

        // Navega a la página de edición del producto
        cy.visit('/edit-product/1');
        cy.wait('@getProduct'); // Espera a que se cargue el producto
    });

    it('Debe actualizar un producto correctamente', () => {
        // Intercepta la solicitud PATCH para actualizar el producto
        cy.intercept('PATCH', '/api/product/1', {
            statusCode: 200,
            body: { message: 'Producto actualizado con éxito' },
        }).as('updateProduct');

        // Completa el formulario con los datos actualizados
        cy.get('input[name="name"]').clear().type('Producto Actualizado'); // Actualiza el nombre
        cy.get('textarea[name="description"]').clear().type('Nueva descripción del producto'); // Actualiza la descripción
        cy.get('input[name="price"]').clear().type('150'); // Actualiza el precio
        cy.get('input[name="stock"]').clear().type('20'); // Actualiza el stock

        // Envía el formulario
        cy.get('button[type="submit"]').click();

        // Verifica que la solicitud PATCH fue interceptada y que la respuesta es correcta
        cy.wait('@updateProduct').then((interception) => {
            expect(interception.response.statusCode).to.eq(200); // Verifica que el código de estado sea 200
            expect(interception.response.body.message).to.eq('Producto actualizado con éxito'); // Verifica el mensaje de respuesta
        });

        // Verifica que el usuario sea redirigido a la lista de productos
        cy.url().should('include', '/product');
    });
});