import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import FloatingCartButton from './components/FloatingCartButton';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import Mall from './pages/Mall';
import Account from './pages/Account';
import ContactAmazon from './pages/ContactAmazon';
import EnvironmentalResponsibility from './pages/EnvironmentalResponsibility';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductDetail from './pages/ProductDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
      <ScrollToTop />
      <FloatingCartButton />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mall" element={<Mall />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/environmental-responsibility" element={<EnvironmentalResponsibility />} />
        <Route path="/contact-amazon" element={<ContactAmazon />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
