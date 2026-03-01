import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductsByCategory } from '../../api/product';
import { addToCart } from '../../api/cart';
import { useCart } from '../../context/CartContext';
import type { ProductData } from '../../types';
import './index.css';

const Category: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { incrementCart } = useCart();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    const categoryName = name.charAt(0).toUpperCase() + name.slice(1);
    getProductsByCategory(categoryName)
      .then((res) => {
        if (res.data.code === 200) {
          setProducts(res.data.data || []);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [name]);

  const handleAddToCart = async (product: ProductData) => {
    try {
      await addToCart({
        productName: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        imageUrl: product.imageUrl || '',
      });
      incrementCart(1);
      alert('Added to cart!');
    } catch {
      alert('Failed to add to cart. Please login first.');
    }
  };

  const categoryTitle = name ? name.charAt(0).toUpperCase() + name.slice(1) : '';

  return (
    <div className="category-page">
      <header className="category-header">
        <Link to="/mall" className="back-link">← Back to Mall</Link>
        <h1>{categoryTitle}</h1>
      </header>

      {loading ? (
        <div className="category-loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="category-empty">
          <h2>No products found in "{categoryTitle}"</h2>
          <p>Check back later for new products!</p>
          <Link to="/mall" className="back-btn">Back to Mall</Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.imageUrl || 'https://via.placeholder.com/200'}
                alt={product.name}
                className="product-img"
                onClick={() => navigate(`/product/${product.id}`)}
              />
              <div className="product-info">
                <h3 className="product-name" onClick={() => navigate(`/product/${product.id}`)}>
                  {product.name}
                </h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
