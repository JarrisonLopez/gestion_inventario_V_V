'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

export default function ProductPage({ params: asyncParams }) {
  const [params, setParams] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');

    (async () => {
      const resolvedParams = await asyncParams;
      setParams(resolvedParams);

      try {
        const res = await fetch(`http://localhost:3000/api/product/${resolvedParams.id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          setError(res.status === 404 ? 'Producto no encontrado' : 'Error al cargar el producto. Por favor, inténtelo más tarde.');
          return;
        }

        const productData = await res.json();
        setProduct(productData);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setError('Error de conexión con el servidor. Por favor, inténtelo más tarde.');
      } finally {
        setLoading(false);
      }
    })();
  }, [asyncParams]);

  const handleDelete = async () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás recuperar este producto después de eliminarlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/api/product/${params.id}`, {
            method: 'DELETE',
          });

          if (!res.ok) throw new Error('Error al eliminar el producto');

          Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
          router.push('/product');
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
          Swal.fire('Error', 'Hubo un problema al eliminar el producto. Por favor, inténtelo más tarde.', 'error');
        }
      }
    });
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
          <h1 className="text-3xl font-bold text-red-600 mb-4">{error}</h1>
          <p className="text-gray-700">Si el problema persiste, por favor contacte al soporte técnico.</p>
          <Link href="/product" className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200">Atrás</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">{product.name}</h1>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-lg font-semibold text-gray-800 mb-2">Precio: <span className="text-blue-600">${product.price}</span></p>
        <p className="text-lg font-semibold text-gray-800">Stock: <span className="text-blue-600">{product.stock}</span></p>
        <div className="flex space-x-4 mt-6">
          {isAdmin && (
            <>
              <Link href={`/edit-product/${params.id}`} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-200">Editar</Link>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-200">Eliminar</button>
            </>
          )}
          <Link href="/product" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200">Atrás</Link>
        </div>
      </div>
    </div>
  );
}

ProductPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};