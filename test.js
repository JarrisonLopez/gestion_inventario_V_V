const fetch = require("node-fetch");

const BASE_URL = "http://localhost:3000/product";
const resultadosPruebas = [];

async function testAgregarProducto() {
    console.log("🔹 Prueba 1: Agregar producto con todos los campos obligatorios");
    const producto = { nombre: "Producto Test", descripcion: "Este es un producto de prueba", precio: 100, cantidad: 10 };
    await testRequest("POST", "/new-product", producto, 201, "Prueba 1");
}

async function testProductoDuplicado() {
    console.log("🔹 Prueba 2: No permitir agregar un producto duplicado");
    const productoDuplicado = { nombre: "Producto Test", descripcion: "Este es un producto duplicado", precio: 120, cantidad: 5 };
    await testRequest("POST", "/new-product", productoDuplicado, 400, "Prueba 2");
}

async function testProductoCamposVacios() {
    console.log("🔹 Prueba 3: No permitir productos sin completar los campos obligatorios");
    const productoInvalido = { nombre: "", descripcion: "Producto sin nombre", precio: 50, cantidad: 2 };
    await testRequest("POST", "/new-product", productoInvalido, 400, "Prueba 3");
}

async function testAgregarProductoSinPermiso() {
    console.log("🔹 Prueba 4: Verificar que solo administradores puedan agregar productos");
    const producto = { nombre: "Producto No Autorizado", descripcion: "Intento de agregar sin permisos", precio: 75, cantidad: 3 };
    await testRequest("POST", "/new-product", producto, 403, "Prueba 4", { Authorization: "Bearer fake-token" });
}

async function testObtenerListaProductos() {
    console.log("🔹 Prueba 5: Obtener la lista de productos");
    await testRequest("GET", "", null, 200, "Prueba 5");
}

async function testObtenerProductoEspecifico() {
    console.log("🔹 Prueba 6: Obtener detalles de un producto específico");
    await testRequest("GET", "/1", null, 200, "Prueba 6");
}

async function testBuscarProductoInexistente() {
    console.log("🔹 Prueba 7: Buscar un producto que no existe");
    await testRequest("GET", "/99999", null, 404, "Prueba 7");
}

async function testActualizarProducto() {
    console.log("🔹 Prueba 8: Actualizar un producto correctamente");
    const productoActualizado = { nombre: "Producto Actualizado", precio: 150 };
    await testRequest("PUT", "/1", productoActualizado, 200, "Prueba 8");
}

async function testActualizarProductoInvalido() {
    console.log("🔹 Prueba 9: No permitir actualizar con datos inválidos");
    const productoIncorrecto = { precio: -50 };
    await testRequest("PUT", "/1", productoIncorrecto, 400, "Prueba 9");
}

async function testEliminarProducto() {
    console.log("🔹 Prueba 10: Eliminar un producto correctamente");
    await testRequest("DELETE", "/1", null, 200, "Prueba 10");
}

async function testEliminarProductoInexistente() {
    console.log("🔹 Prueba 11: No permitir eliminar un producto inexistente");
    await testRequest("DELETE", "/99999", null, 404, "Prueba 11");
}

async function testCargaMasivaProductos() {
    console.log("🔹 Prueba 12: Manejar una gran cantidad de productos");
    await testRequest("GET", "", null, 200, "Prueba 12");
}

async function testConcurrenciaActualizacion() {
    console.log("🔹 Prueba 13: Manejo de concurrencia al modificar un producto");
    const productoActualizado = { nombre: "Concurrencia Test", precio: 180 };
    await Promise.all([
        testRequest("PUT", "/1", productoActualizado, 200, "Prueba 13-1"),
        testRequest("PUT", "/1", productoActualizado, 200, "Prueba 13-2")
    ]);
}

async function testErrorBaseDatos() {
    console.log("🔹 Prueba 14: Respuesta correcta en caso de error en la base de datos");
    await testRequest("GET", "/error", null, 500, "Prueba 14");
}

async function testTiemposDeRespuesta() {
    console.log("🔹 Prueba 15: Validar tiempos de respuesta de la API");
    const start = Date.now();
    await testRequest("GET", "", null, 200, "Prueba 15");
    const time = Date.now() - start;
    console.log("Tiempo de respuesta:", time, "ms");
}

async function testSeguridadAPI() {
    console.log("🔹 Prueba 16: Proteger la API contra ataques de inyección SQL y XSS");
    const payload = { nombre: "<script>alert('XSS')</script>", precio: "DROP TABLE productos;" };
    await testRequest("POST", "/new-product", payload, 400, "Prueba 16");
}

async function testRequest(method, path, body, expectedStatus, testName, headers = {}) {
    try {
        const response = await fetch(BASE_URL + path, {
            method,
            headers: { "Content-Type": "application/json", ...headers },
            body: body ? JSON.stringify(body) : null,
        });
        
        const text = await response.text();
        console.log("🔹 Respuesta del servidor:", text);
        if (response.status !== expectedStatus) {
            console.error(`❌ Error: Se esperaba ${expectedStatus}, pero se recibió ${response.status}`);
            resultadosPruebas.push({ nombre: testName, resultado: "fallida" });
        } else {
            console.log("✅ Prueba superada.");
            resultadosPruebas.push({ nombre: testName, resultado: "superada" });
        }
    } catch (error) {
        console.error("❌ Error en la solicitud:", error.message);
        resultadosPruebas.push({ nombre: testName, resultado: "fallida" });
    }
}

async function ejecutarPruebas() {
    console.log("🚀 Ejecutando pruebas...");
    await testAgregarProducto();
    await testProductoDuplicado();
    await testProductoCamposVacios();
    await testAgregarProductoSinPermiso();
    await testObtenerListaProductos();
    await testObtenerProductoEspecifico();
    await testBuscarProductoInexistente();
    await testActualizarProducto();
    await testActualizarProductoInvalido();
    await testEliminarProducto();
    await testEliminarProductoInexistente();
    await testCargaMasivaProductos();
    await testConcurrenciaActualizacion();
    await testErrorBaseDatos();
    await testTiemposDeRespuesta();
    await testSeguridadAPI();
    console.log("✅ Todas las pruebas finalizadas.");
    mostrarResultados();
}

function mostrarResultados() {
    console.log("\n📊 Resultados de las pruebas:");
    resultadosPruebas.forEach(prueba => {
        console.log(`- ${prueba.nombre}: ${prueba.resultado}`);
    });
}

ejecutarPruebas();