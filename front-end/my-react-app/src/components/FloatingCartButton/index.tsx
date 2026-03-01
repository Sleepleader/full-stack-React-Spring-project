import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './index.css';

const FloatingCartButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  // Hide on login, register, cart, and all admin pages
  const hiddenPaths = ['/login', '/register', '/cart'];
  if (hiddenPaths.includes(location.pathname)) return null;
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <button className="floating-cart-btn" onClick={() => navigate('/cart')} title="Shopping Cart">
      <svg
        className="cart-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {cartCount > 0 && (
        <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
      )}
    </button>
  );
};

export default FloatingCartButton;
