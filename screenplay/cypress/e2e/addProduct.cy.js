describe('Pruebas E2E de agregar producto', () => {
    beforeEach(() => {
        // Configura el rol en el localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('role', 'admin'); // Establece el rol como 'admin'
        });

        // Intercepta la solicitud POST para agregar el producto
        cy.intercept('POST', '/api/product', {
            statusCode: 201,
            body: { message: 'Producto agregado exitosamente' },
        }).as('addProduct');

        // Navega a la página de agregar producto
        cy.visit('/product/new-product');
    });

    it('Debe agregar un producto con todos los campos obligatorios', () => {
        // Completa el formulario con los datos del producto
        cy.get('#name').type('Producto Test'); // Ingresa el nombre del producto
        cy.get('#description').type('Este es un producto de prueba'); // Ingresa la descripción
        cy.get('#price').type('100'); // Ingresa el precio
        cy.get('#stock').type('10'); // Ingresa el stock

        // Envía el formulario
        cy.get('button[type="submit"]').click();

        // Verifica que la solicitud POST fue interceptada y que la respuesta es correcta
        cy.wait('@addProduct').then((interception) => {
            expect(interception.response.statusCode).to.eq(201); // Verifica que el código de estado sea 201
            expect(interception.response.body.message).to.eq('Producto agregado exitosamente'); // Verifica el mensaje de respuesta
        });

        // Verifica que el usuario sea redirigido a la página de productos
        cy.url().should('include', '/product');
    });
});