const { By, Key } = require('selenium-webdriver');
const { getDriver } = require('./utils/driverSetup'); // Importa el WebDriver configurado

(async function testSearchProduct() {
    const driver = await getDriver(); // Obtiene el WebDriver configurado

    try {
        // Navega a la página de productos
        await driver.get('http://localhost:3000/product');

        // Encuentra el campo de búsqueda y escribe el nombre del producto
        const searchBox = await driver.findElement(By.css('input[placeholder="Buscar por nombre"]'));
        await searchBox.sendKeys('Producto Test', Key.RETURN);

        // Espera un momento para que se actualicen los resultados
        await driver.sleep(2000);

        // Verifica que el producto buscado esté visible
        const pageSource = await driver.getPageSource();
        if (!pageSource.includes('Producto Test')) {
            throw new Error('El producto no se encontró en los resultados.');
        }

        console.log('Prueba exitosa: El producto fue encontrado.');
    } catch (error) {
        console.error('Error en la prueba:', error);
    } finally {
        // Cierra el navegador
        await driver.quit();
    }
})();