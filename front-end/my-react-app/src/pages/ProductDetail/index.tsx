import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../../api/product';
import { addToCart } from '../../api/cart';
import { useCart } from '../../context/CartContext';
import type { ProductData } from '../../types';
import './index.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { incrementCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(Number(id))
      .then((res) => {
        if (res.data.code === 200) {
          setProduct(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart({
        productName: product.name,
        price: product.price,
        quantity,
        category: product.category,
        imageUrl: product.imageUrl,
      });
      incrementCart(quantity);
      alert('Added to cart!');
    } catch {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-loading">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <div className="pd-not-found">
          <h2>Product not found</h2>
          <Link to="/mall">Back to Mall</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page">
      {/* Top Nav */}
      <header className="pd-nav">
        <div className="pd-nav-inner">
          <Link to="/mall" className="pd-brand">Amazon</Link>
          <div className="pd-nav-right">
            <button onClick={() => navigate('/cart')}>🛒 Cart</button>
            <button onClick={() => navigate('/orders')}>Orders</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pd-main">
        <div className="pd-breadcrumb">
          <Link to="/mall">Home</Link>
          <span> / </span>
          <Link to={`/category/${product.category.toLowerCase()}`}>{product.category}</Link>
          <span> / </span>
          <span>{product.name}</span>
        </div>

        <div className="pd-content">
          {/* Left: Image */}
          <div className="pd-image-col">
            <img src={product.imageUrl} alt={product.name} className="pd-image" />
          </div>

          {/* Right: Details */}
          <div className="pd-info-col">
            <h2 className="pd-title">{product.name}</h2>
            <div className="pd-price">${product.price.toFixed(2)}</div>

            {/* Quantity Selector */}
            <div className="pd-quantity">
              <span className="pd-quantity-label">Quantity:</span>
              <div className="pd-quantity-controls">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="pd-qty-value">{quantity}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              className="pd-add-to-cart"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>

            {/* Description */}
            <div className="pd-description">
              <h3>Product Description</h3>
              <p>{product.description || 'No description available.'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
