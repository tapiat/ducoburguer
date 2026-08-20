import { useState, useEffect } from 'react';
import api from '../services/api';

function MenuPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <div>
      <h1>Menú</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles todavía.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> — ${Number(product.price).toLocaleString('es-CL')}
              <p>{product.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MenuPage;