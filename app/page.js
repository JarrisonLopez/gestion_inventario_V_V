import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 font-inter">
      <div className="w-full max-w-4xl px-8 py-12 bg-white rounded-3xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">Bienvenido a nuestra tienda</h1>
        <p className="text-lg text-gray-700 mb-8">
          Explora nuestra increíble variedad de productos y encuentra lo que necesitas.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/product"
            className="px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-200 transition duration-200"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
