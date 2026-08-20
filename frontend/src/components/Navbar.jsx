import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">🍔 Duco Burger</Link>
      <Link to="/">Menú</Link>
      <Link to="/cart">Carrito</Link>
      <Link to="/login">Iniciar sesión</Link>
      <Link to="/register">Registrarse</Link>
      <Link to="/orders">Mis Pedidos</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}

export default Navbar;