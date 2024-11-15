'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function EditProductPage({ params: asyncParams }) {
  const [params, setParams] = useState(null);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();

  // Resolver los parámetros asíncronos
  useEffect(() => {
    (async () => {
      const resolvedParams = await asyncParams;
      setParams(resolvedParams);
    })();
  }, [asyncParams]);

  useEffect(() => {
    if (!params?.id) return;

    // Fetch del producto para prellenar el formulario
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${params.id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        const data = await res.json();
        setProduct(data);
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Limpiar el error de validación cuando el usuario escribe
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!form.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!form.description.trim()) errors.description = 'La descripción es obligatoria.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errors.price = 'El precio debe ser un número válido mayor que 0.';
    }
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      errors.stock = 'El stock debe ser un número válido mayor o igual a 0.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario
    if (!validateForm()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor corrige los errores antes de continuar.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/product/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error al actualizar el producto');

      // SweetAlert para éxito
      Swal.fire({
        title: '¡Éxito!',
        text: 'Producto actualizado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        router.push('/product'); // Redirige a la lista de productos
      });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);

      // SweetAlert para error
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el producto. Por favor, inténtelo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <p className="text-gray-700">Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Editar Producto</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
            {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
            {validationErrors.description && <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              {validationErrors.price && <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>}
            </div>
            <div className="w-1/2">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
              {validationErrors.stock && <p className="mt-1 text-sm text-red-600">{validationErrors.stock}</p>}
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
