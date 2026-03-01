import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders, getOrderItems } from '../../api/order';
import type { OrderData, OrderItemData } from '../../types';
import './index.css';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItemData[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders()
      .then((res) => {
        if (res.data.code === 200) {
          setOrders(res.data.data || []);
        }
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleOrder = async (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    setExpandedOrder(orderId);
    if (!orderItems[orderId]) {
      try {
        const res = await getOrderItems(orderId);
        if (res.data.code === 200) {
          setOrderItems((prev) => ({ ...prev, [orderId]: res.data.data || [] }));
        }
      } catch { /* ignore */ }
    }
  };

  return (
    <div className="orders-page">
      <header className="orders-header">
        <Link to="/mall" className="back-link">← Back to Mall</Link>
        <h1>Your Orders</h1>
      </header>

      {loading ? (
        <div className="orders-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here.</p>
          <Link to="/mall" className="shop-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header" onClick={() => toggleOrder(order.id)}>
                <div className="order-meta">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{new Date(order.createTime).toLocaleDateString()}</span>
                </div>
                <div className="order-info">
                  <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                  <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                  <span className="expand-icon">{expandedOrder === order.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedOrder === order.id && (
                <div className="order-details">
                  {orderItems[order.id] ? (
                    orderItems[order.id].map((item) => (
                      <div className="order-item" key={item.id}>
                        <img src={item.imageUrl || 'https://via.placeholder.com/60'} alt={item.productName} className="order-item-img" />
                        <div className="order-item-info">
                          <span className="order-item-name">{item.productName}</span>
                          <span className="order-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="order-loading">Loading items...</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
