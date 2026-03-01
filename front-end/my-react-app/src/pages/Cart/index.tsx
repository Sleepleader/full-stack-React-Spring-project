import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCartItems, updateCartItemQuantity, deleteCartItem } from '../../api/cart';
import { checkout } from '../../api/order';
import { useCart } from '../../context/CartContext';
import type { CartItemData } from '../../types';
import './index.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await getCartItems();
      if (res.data.code === 200) {
        setItems(res.data.data || []);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleQuantityChange = async (item: CartItemData, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    try {
      await updateCartItemQuantity(item.id, newQty);
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, quantity: newQty } : i));
      refreshCart();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCartItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
      refreshCart();
    } catch { /* ignore */ }
  };

  const selectedItems = items.filter((i) => selectedIds.has(i.id));
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleCheckout = async () => {
    if (selectedIds.size === 0) {
      alert('Please select items to checkout');
      return;
    }
    try {
      const res = await checkout(Array.from(selectedIds));
      if (res.data.code === 200) {
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        alert(res.data.message || 'Checkout failed');
      }
    } catch {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <Link to="/mall" className="back-link">← Continue Shopping</Link>
        <h1>Shopping Cart</h1>
      </header>

      {loading ? (
        <div className="cart-loading">Loading your cart...</div>
      ) : items.length === 0 ? (
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <Link to="/mall" className="shop-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-select-all">
              <label>
                <input type="checkbox" checked={selectedIds.size === items.length} onChange={toggleSelectAll} />
                Select All ({items.length} items)
              </label>
            </div>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.productName} className="cart-item-img" />
                <div className="cart-item-details">
                  <h3>{item.productName}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Subtotal ({totalItems} items): <span className="summary-price">${subtotal.toFixed(2)}</span></h2>
            <button className="checkout-btn" onClick={handleCheckout} disabled={selectedIds.size === 0}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
