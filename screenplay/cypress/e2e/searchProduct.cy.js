describe('Pruebas E2E para buscar un producto', () => {
    beforeEach(() => {
        // Configura el rol en el localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('role', 'admin'); // Establece el rol como 'admin'
        });

        // Intercepta la solicitud GET para cargar la lista de productos
        cy.intercept('GET', '/api/product', {
            statusCode: 200,
            body: [
                { _id: '1', name: 'Producto Test', price: 100 },
                { _id: '2', name: 'Producto Ejemplo', price: 200 },
            ],
        }).as('getProducts');

        // Navega a la página de productos
        cy.visit('/product');
        cy.wait('@getProducts'); // Espera a que se cargue la lista de productos
    });

    it('Debe buscar un producto correctamente por nombre', () => {
        // Simula la búsqueda de un producto por nombre
        cy.get('input[placeholder="Buscar por nombre"]').type('Producto Test');
        cy.wait(500); // Espera un breve tiempo para que se apliquen los filtros

        // Verifica que solo el producto buscado se muestre en la lista
        cy.contains('Producto Test').should('be.visible');
        cy.contains('Producto Ejemplo').should('not.exist');
    });

    it('Debe buscar un producto correctamente por precio máximo', () => {
        // Simula la búsqueda de un producto por precio máximo
        cy.get('input[placeholder="Precio máximo"]').type('150');
        cy.wait(500); // Espera un breve tiempo para que se apliquen los filtros

        // Verifica que solo los productos con precio <= 150 se muestren en la lista
        cy.contains('Producto Test').should('be.visible');
        cy.contains('Producto Ejemplo').should('not.exist');
    });

    it('Debe mostrar todos los productos si no se aplican filtros', () => {
        // Verifica que ambos productos se muestren en la lista sin filtros
        cy.contains('Producto Test').should('be.visible');
        cy.contains('Producto Ejemplo').should('be.visible');
    });
});