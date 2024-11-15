'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const role = localStorage.getItem('role');
    console.log(role);
    if (!role || role !== 'admin') {
      router.push(role ? '/product' : '/login'); // Redirige si no es admin
    }
  }, [router]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!form.price || isNaN(Number(form.price))) newErrors.price = 'El precio debe ser un número válido';
    if (!form.stock || isNaN(Number(form.stock))) newErrors.stock = 'El stock debe ser un número válido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      router.push('/product');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 font-inter">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Crear Nuevo Producto</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-blue-800 mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent text-blue-900 bg-blue-50"
              placeholder="Nombre del producto"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-blue-800 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent text-blue-900 bg-blue-50"
              placeholder="Descripción del producto"
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="price" className="block text-sm font-semibold text-blue-800 mb-2">
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
                className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent text-blue-900 bg-blue-50"
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            <div className="w-1/2">
              <label htmlFor="stock" className="block text-sm font-semibold text-blue-800 mb-2">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-transparent text-blue-900 bg-blue-50"
                placeholder="0"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 transition duration-200 ease-in-out"
            >
              {isLoading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
