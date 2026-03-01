import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminProducts, addAdminProduct, updateAdminProduct, deleteAdminProduct,
  getAdminUsers, addAdminUser, deleteAdminUser,
  getAdminOrders, deleteAdminOrder,
} from '../../api/admin';
import './index.css';

type Tab = 'products' | 'users' | 'orders';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check admin session
  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) navigate('/admin-login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header">
          <button className="sidebar-toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
          {!sidebarCollapsed && <h2>Admin Panel</h2>}
        </div>
        <nav className="admin-sidebar-nav">
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')} title="Product Management">
            <span className="nav-icon">📦</span>
            {!sidebarCollapsed && <span className="nav-label">Product Management</span>}
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')} title="User Management">
            <span className="nav-icon">👤</span>
            {!sidebarCollapsed && <span className="nav-label">User Management</span>}
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')} title="Order Management">
            <span className="nav-icon">📋</span>
            {!sidebarCollapsed && <span className="nav-label">Order Management</span>}
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout} title="Log out">
          <span className="nav-icon">🚪</span>
          {!sidebarCollapsed && <span className="nav-label">Log out</span>}
        </button>
      </aside>
      <main className="admin-content">
        {activeTab === 'products' && <ProductPanel />}
        {activeTab === 'users' && <UserPanel />}
        {activeTab === 'orders' && <OrderPanel />}
      </main>
    </div>
  );
};

// ==================== Product Management ====================
const ProductPanel: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', price: '', imageUrl: '', category: '', description: '' });
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAdminProducts();
      if (res.data.code === 200) setProducts(res.data.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', price: '', imageUrl: '', category: '', description: '' });
    setShowForm(true);
    setError('');
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), imageUrl: p.imageUrl || '', category: p.category, description: p.description || '' });
    setShowForm(true);
    setError('');
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) { setError('Name, Price, and Category are required'); return; }
    try {
      const payload = { name: form.name, price: parseFloat(form.price), imageUrl: form.imageUrl, category: form.category, description: form.description };
      if (editingId) {
        await updateAdminProduct(editingId, payload);
      } else {
        await addAdminProduct(payload);
      }
      setShowForm(false);
      fetchProducts();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product and its associated order items?')) return;
    try {
      await deleteAdminProduct(id);
      fetchProducts();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h1>Product Management</h1>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="admin-form-grid">
            <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Price *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input placeholder="Category *" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="admin-form-actions">
            <button className="admin-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="admin-save-btn" onClick={handleSave}>Save</button>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Image</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.category}</td>
                <td>{p.imageUrl ? <img src={p.imageUrl} alt="" className="admin-thumb" /> : '—'}</td>
                <td>
                  <button className="admin-edit-btn" onClick={() => openEdit(p)}>Edit</button>
                  <button className="admin-delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ==================== User Management ====================
const UserPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '' });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      if (res.data.code === 200) setUsers(res.data.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    if (!form.username || !form.password || !form.email || !form.phone) { setError('All fields are required'); return; }
    try {
      await addAdminUser(form);
      setShowForm(false);
      setForm({ username: '', password: '', email: '', phone: '' });
      fetchUsers();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to add user');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user and all associated data (orders, cart)?')) return;
    try {
      await deleteAdminUser(id);
      fetchUsers();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h1>User Management</h1>
        <button className="admin-add-btn" onClick={() => { setShowForm(true); setError(''); }}>+ Add User</button>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h3>Add User</h3>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="admin-form-grid">
            <input placeholder="Username *" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            <input placeholder="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <input placeholder="Email *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="admin-form-actions">
            <button className="admin-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="admin-save-btn" onClick={handleAdd}>Add</button>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Username</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <button className="admin-delete-btn" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ==================== Order Management ====================
const OrderPanel: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders();
      if (res.data.code === 200) setOrders(res.data.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (orderId: number) => {
    if (!confirm('Delete this order and all its items?')) return;
    try {
      await deleteAdminOrder(orderId);
      fetchOrders();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Failed to delete order');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h1>Order Management</h1>
      </div>
      <p className="admin-design-note">
        💡 <strong>Design Note:</strong> <code>t_order</code> and <code>t_order_item</code> are kept as separate tables
        following standard relational database design (One Order → Many Items). This avoids data redundancy, supports
        flexible querying, and conforms to Third Normal Form (3NF). Deleting an order cascades to its items via
        <code>ON DELETE CASCADE</code> + backend logic.
      </p>

      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr><th>Order ID</th><th>User ID</th><th>Total Price</th><th>Products</th><th>Quantity</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.userId}</td>
                <td>${o.totalPrice}</td>
                <td>
                  <div className="order-items-inline">
                    {o.items && o.items.length > 0
                      ? o.items.map((item: any, idx: number) => (
                          <div key={idx} className="order-item-line">{item.productName}</div>
                        ))
                      : <span className="no-items">—</span>}
                  </div>
                </td>
                <td>
                  <div className="order-items-inline">
                    {o.items && o.items.length > 0
                      ? o.items.map((item: any, idx: number) => (
                          <div key={idx} className="order-item-line">×{item.quantity}</div>
                        ))
                      : <span className="no-items">—</span>}
                  </div>
                </td>
                <td>{o.createTime?.replace('T', ' ')}</td>
                <td>
                  <button className="admin-delete-btn" onClick={() => handleDelete(o.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
