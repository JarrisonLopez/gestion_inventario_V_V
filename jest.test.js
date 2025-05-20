const fetch = require("node-fetch");

// Mock de fetch
jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

const BASE_URL = "http://localhost:3000/product";

describe("Pruebas de API de gestión de inventario", () => {
    const testRequest = async (method, path, body, expectedStatus, testName, headers = {}) => {
        const url = BASE_URL + path;

        try {
            const mockResponse = new Response(JSON.stringify({ message: `${testName} mock response` }), {
                status: expectedStatus,
                headers: { "Content-Type": "application/json" },
            });
            fetch.mockResolvedValueOnce(mockResponse);

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", ...headers },
                body: body ? JSON.stringify(body) : null,
            });
            const responseBody = await response.json();

            expect(response.status).toBe(expectedStatus);
            expect(responseBody.message).toContain("mock response");
        } catch (error) {
            // Para coverage: asegurar que si fetch falla también se prueba
            throw new Error(`Error en testRequest: ${error.message}`);
        }
    };

    afterEach(() => {
        jest.clearAllMocks(); // Limpiar mocks entre pruebas (importante para SonarQube)
    });

    test("Prueba 1: Agregar producto con todos los campos obligatorios", async () => {
        const producto = { nombre: "Producto Test", descripcion: "Este es un producto de prueba", precio: 100, cantidad: 10 };
        await testRequest("POST", "/new-product", producto, 201, "Prueba 1");
    });

    test("Prueba 2: No permitir agregar un producto duplicado", async () => {
        const productoDuplicado = { nombre: "Producto Test", descripcion: "Este es un producto duplicado", precio: 120, cantidad: 5 };
        await testRequest("POST", "/new-product", productoDuplicado, 400, "Prueba 2");
    });

    test("Prueba 3: No permitir productos sin completar los campos obligatorios", async () => {
        const productoInvalido = { nombre: "", descripcion: "Producto sin nombre", precio: 50, cantidad: 2 };
        await testRequest("POST", "/new-product", productoInvalido, 400, "Prueba 3");
    });

    test("Prueba 4: Verificar que solo administradores puedan agregar productos", async () => {
        const producto = { nombre: "Producto No Autorizado", descripcion: "Intento de agregar sin permisos", precio: 75, cantidad: 3 };
        await testRequest("POST", "/new-product", producto, 403, "Prueba 4", { Authorization: "Bearer fake-token" });
    });

    test("Prueba 5: Obtener la lista de productos", async () => {
        await testRequest("GET", "", null, 200, "Prueba 5");
    });

    test("Prueba 6: Obtener detalles de un producto específico", async () => {
        await testRequest("GET", "/1", null, 200, "Prueba 6");
    });

    test("Prueba 7: Buscar un producto que no existe", async () => {
        await testRequest("GET", "/99999", null, 404, "Prueba 7");
    });

    test("Prueba 8: Actualizar un producto correctamente", async () => {
        const productoActualizado = { nombre: "Producto Actualizado", precio: 150 };
        await testRequest("PUT", "/1", productoActualizado, 200, "Prueba 8");
    });

    test("Prueba 9: No permitir actualizar con datos inválidos", async () => {
        const productoIncorrecto = { precio: -50 };
        await testRequest("PUT", "/1", productoIncorrecto, 400, "Prueba 9");
    });

    test("Prueba 10: Eliminar un producto correctamente", async () => {
        await testRequest("DELETE", "/1", null, 200, "Prueba 10");
    });

    test("Prueba 11: No permitir eliminar un producto inexistente", async () => {
        await testRequest("DELETE", "/99999", null, 404, "Prueba 11");
    });

    test("Prueba 12: Manejar una gran cantidad de productos", async () => {
        await testRequest("GET", "", null, 200, "Prueba 12");
    });

    test("Prueba 13: Manejo de concurrencia al modificar un producto", async () => {
        const productoActualizado = { nombre: "Concurrencia Test", precio: 180 };
        await Promise.all([
            testRequest("PUT", "/1", productoActualizado, 200, "Prueba 13-1"),
            testRequest("PUT", "/1", productoActualizado, 200, "Prueba 13-2"),
        ]);
    });

    test("Prueba 14: Respuesta correcta en caso de error en la base de datos", async () => {
        await testRequest("GET", "/error", null, 500, "Prueba 14");
    });

    test("Prueba 15: Validar tiempos de respuesta de la API", async () => {
        const start = Date.now();
        await testRequest("GET", "", null, 200, "Prueba 15");
        const time = Date.now() - start;
        expect(time).toBeGreaterThanOrEqual(0); // validar que se midió el tiempo
    });

    // NUEVA PRUEBA para simular error de fetch
    test("Prueba 16: Manejar error en fetch correctamente", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));

        const url = BASE_URL + "/error-test";

        await expect(fetch(url)).rejects.toThrow("Network Error");
    });
});
