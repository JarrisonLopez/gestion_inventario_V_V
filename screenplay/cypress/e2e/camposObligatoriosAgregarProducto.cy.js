describe('Validación de campos obligatorios al agregar producto', () => {
    beforeEach(() => {
        // Configura el rol en el localStorage
        cy.window().then((win) => {
            win.localStorage.setItem('role', 'admin'); // Establece el rol como 'admin'
        });

        // Navega a la página de agregar producto
        cy.visit('/product/new-product');
    });

    it('No debe permitir agregar un producto sin completar los campos obligatorios', () => {
        // Deja los campos vacíos y envía el formulario
        cy.get('button[type="submit"]').click();

        // Verifica que los mensajes de error se muestren para los campos obligatorios
        cy.contains('El nombre es obligatorio').should('be.visible');
        cy.contains('La descripción es obligatoria').should('be.visible');
        cy.contains('El precio debe ser un número válido').should('be.visible');
        cy.contains('El stock debe ser un número válido').should('be.visible');

        // Verifica que no se haya enviado ninguna solicitud POST
        cy.intercept('POST', '/api/product').as('addProduct');
        cy.wait(500); // Espera un breve tiempo para asegurarse de que no se envió la solicitud
        cy.get('@addProduct.all').should('have.length', 0); // No debe haber solicitudes
    });
});