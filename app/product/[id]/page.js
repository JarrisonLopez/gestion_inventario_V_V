import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ProductPage({ params: asyncParams }) {
  const [params, setParams] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");

    (async () => {
      const resolvedParams = await asyncParams;
      setParams(resolvedParams);

      try {
        const res = await fetch(`http://localhost:3000/api/product/${resolvedParams.id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setError(res.status === 404 ? "Producto no encontrado" : "Error al cargar el producto. Por favor, inténtelo más tarde.");
          return;
        }

        const productData = await res.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setError("Error de conexión con el servidor. Por favor, inténtelo más tarde.");
      } finally {
        setLoading(false);
      }
    })();
  }, [asyncParams]);

  const handleDelete = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este producto después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/api/product/${params.id}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            throw new Error("Error al eliminar el producto");
          }

          Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
          router.push("/product"); 
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
          Swal.fire("Error", "Hubo un problema al eliminar el producto. Por favor, inténtelo más tarde.", "error");
        }
      }
    });
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <p>Stock: {product.stock}</p>

      {isAdmin && (
        <>
          <Link href={`/edit-product/${params.id}`}>Editar</Link>
          <button onClick={handleDelete}>Eliminar</button>
        </>
      )}

      <Link href="/product">Atrás</Link>
    </div>
  );
}

// ✅ Validación de props con PropTypes
ProductPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
