import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>${Number(product.price).toLocaleString('es-CL')}</p>
      <button onClick={() => addItem(product)}>Agregar al carrito</button>
    </div>
  );
}

export default ProductCard;