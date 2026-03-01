import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import './index.css';

const CATEGORIES = ['Household', 'Gaming', 'Kitchen', 'Food', 'Cloths', 'Electronics', 'Books', 'Flowers'];

const CAROUSEL_ITEMS = [
  { type: 'image' as const, src: 'https://m.media-amazon.com/images/I/51xq9SFUNcL.SR1500,300.jpg' },
  { type: 'image' as const, src: 'https://m.media-amazon.com/images/I/71CQ0WNv6kL.SR3000,600.jpg' },
  { type: 'video' as const, src: 'https://m.media-amazon.com/images/I/A1ahbGj8uKL.mp4' },
];

const BLOCKS = [
  { title: 'Buy Household Essentials', image: 'https://m.media-amazon.com/images/I/81x0t0axsML.AC_UY218.jpg', linkText: 'Learn More on the Homepage', route: '/category/household' },
  { title: 'Enjoy Gaming', image: 'https://m.media-amazon.com/images/I/61vCgvxF67L.AC_UY218.jpg', linkText: 'Shop Now', route: '/category/gaming' },
  { title: 'Kitchen Supplies', image: 'https://m.media-amazon.com/images/I/71WQU+L-qPL.AC_UL320.jpg', linkText: 'Browse', route: '/category/kitchen' },
  { title: 'Food', image: 'https://m.media-amazon.com/images/I/71WtxFMhfCL.AC_UL320.jpg', linkText: 'Learn More', route: '/category/food' },
  { title: 'Buy Fashion Items at Lower Prices', image: 'https://m.media-amazon.com/images/I/51RfMM4Oi9L.AC_UL320.jpg', linkText: 'View All Offers', route: '/category/clothing' },
  { title: 'Electronics', image: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_Electronics_1x._SY304_CB432774322_.jpg', linkText: 'View More', route: '/category/electronics' },
  { title: 'Books', image: 'https://m.media-amazon.com/images/I/81M1JOJZFmL.AC_UY218.jpg', linkText: 'Read More', route: '/category/books' },
  { title: 'Flowers', image: 'https://m.media-amazon.com/images/I/61LrzIHI+4L.AC_UL320.jpg', linkText: 'Explore More', route: '/category/flowers' },
];

const Mall: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchHighlight, setSearchHighlight] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [switchUsername, setSwitchUsername] = useState('');
  const [switchPassword, setSwitchPassword] = useState('');
  const [switchLoading, setSwitchLoading] = useState(false);
  const [switchError, setSwitchError] = useState('');
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getUsername = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username || payload.sub || '123456';
      }
    } catch { /* ignore */ }
    return '123456';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSwitchAccount = async () => {
    if (!switchUsername.trim() || !switchPassword.trim()) return;
    setSwitchLoading(true);
    setSwitchError('');
    try {
      const res = await login({ username: switchUsername.trim(), password: switchPassword.trim() });
      if (res.data.code === 200 && res.data.data?.token) {
        localStorage.setItem('token', res.data.data.token);
        setSwitchModalOpen(false);
        setSwitchUsername('');
        setSwitchPassword('');
        window.location.href = '/mall';
      } else {
        setSwitchError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      setSwitchError(err?.response?.data?.message || 'Login failed');
    } finally {
      setSwitchLoading(false);
    }
  };

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (CAROUSEL_ITEMS[carouselIndex].type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [carouselIndex]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat === 'ALL' ? '' : cat);
    setDropdownOpen(false);
    if (cat !== 'ALL') {
      setSearchHighlight(true);
      setTimeout(() => setSearchHighlight(false), 2000);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;
    // Fuzzy match for gaming-related terms
    const gamingKeywords = ['game', 'gaming', 'super smash', 'minecraft', 'smash bros'];
    if (gamingKeywords.some((k) => term.includes(k) || k.includes(term))) {
      navigate('/category/gaming');
      return;
    }
    // For other categories, try to match
    const matchedCat = CATEGORIES.find((c) => c.toLowerCase().includes(term));
    if (matchedCat) {
      navigate(`/category/${matchedCat.toLowerCase()}`);
      return;
    }
    // No match found — do nothing (or show a "no results" toast in the future)
    alert(`No results found for "${searchTerm.trim()}"`);
  };

  const goCarousel = (dir: number) => {
    setCarouselIndex((prev) => (prev + dir + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
    startTimer();
  };

  return (
    <div className="mall-container">
      {/* ===== Top Navbar ===== */}
      <header className="mall-navbar">
        <div className="navbar-inner">
          <Link to="/mall" className="nav-brand">Amazon</Link>

          <div className="nav-category" onMouseLeave={() => setDropdownOpen(false)}>
            <button className="category-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="hamburger">☰</span> {selectedCategory || 'ALL'}
              <span className="arrow-down">▾</span>
            </button>
            {dropdownOpen && (
              <ul className="category-dropdown">
                <li className={selectedCategory === '' ? 'active' : ''} onClick={() => handleCategorySelect('ALL')}>
                  ALL
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat} className={cat === selectedCategory ? 'active' : ''} onClick={() => handleCategorySelect(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`nav-search ${searchHighlight ? 'search-highlight' : ''}`}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>🔍</button>
          </div>

          <div className="nav-right">
            <div className="account-dropdown-wrapper" ref={accountDropdownRef}>
              <button className="nav-link" onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}>
                <span className="nav-link-top">Hello, {getUsername()}</span>
                <span className="nav-link-bottom">Account ▾</span>
              </button>
              {accountDropdownOpen && (
                <ul className="account-dropdown">
                  <li onClick={() => { setAccountDropdownOpen(false); navigate('/account'); }}>Account Details</li>
                  <li onClick={() => { setAccountDropdownOpen(false); setSwitchModalOpen(true); }}>Switch Account</li>
                  <li className="logout-item" onClick={() => { setAccountDropdownOpen(false); handleLogout(); }}>Log out</li>
                </ul>
              )}
            </div>
            <button className="nav-link" onClick={() => navigate('/orders')}>
              <span className="nav-link-top">Returns</span>
              <span className="nav-link-bottom">& Orders</span>
            </button>
            <button className="nav-link cart-btn" onClick={() => navigate('/cart')}>
              🛒 <span className="cart-text">Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===== Carousel ===== */}
      <div className="carousel-wrapper">
        <button className="carousel-arrow left" onClick={() => goCarousel(-1)}>❮</button>
        <div className="carousel-slide">
          {CAROUSEL_ITEMS[carouselIndex].type === 'image' ? (
            <img src={CAROUSEL_ITEMS[carouselIndex].src} alt="banner" />
          ) : (
            <video
              ref={videoRef}
              src={CAROUSEL_ITEMS[carouselIndex].src}
              muted
              playsInline
              onEnded={() => goCarousel(1)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
        <button className="carousel-arrow right" onClick={() => goCarousel(1)}>❯</button>
        <div className="carousel-dots">
          {CAROUSEL_ITEMS.map((_, i) => (
            <span key={i} className={`dot ${i === carouselIndex ? 'active' : ''}`} onClick={() => { setCarouselIndex(i); startTimer(); }} />
          ))}
        </div>
      </div>

      {/* ===== 8-Block Navigation Grid ===== */}
      <section className="blocks-section">
        <div className="blocks-grid">
          {BLOCKS.map((block, idx) => (
            <div className="block-card" key={idx}>
              <h2>{block.title}</h2>
              <img
                src={block.image}
                alt={block.title}
                width={379}
                height={304}
                className="block-img"
              />
              <Link to={block.route} className="block-link">{block.linkText}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Switch Account Modal ===== */}
      {switchModalOpen && (
        <div className="switch-modal-overlay" onClick={() => setSwitchModalOpen(false)}>
          <div className="switch-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="switch-modal-title">Switch Account</h2>
            <p className="switch-modal-desc">Enter credentials for another account</p>
            {switchError && <div className="switch-modal-error">{switchError}</div>}
            <input
              className="switch-modal-input"
              type="text"
              placeholder="Username"
              value={switchUsername}
              onChange={(e) => setSwitchUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSwitchAccount()}
            />
            <input
              className="switch-modal-input"
              type="password"
              placeholder="Password"
              value={switchPassword}
              onChange={(e) => setSwitchPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSwitchAccount()}
            />
            <div className="switch-modal-actions">
              <button className="switch-modal-cancel" onClick={() => { setSwitchModalOpen(false); setSwitchError(''); setSwitchUsername(''); setSwitchPassword(''); }}>Cancel</button>
              <button className="switch-modal-confirm" onClick={handleSwitchAccount} disabled={switchLoading || !switchUsername.trim() || !switchPassword.trim()}>
                {switchLoading ? 'Signing in...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Footer ===== */}
      <footer className="mall-footer">
        <div className="footer-columns">
          <div className="footer-column">
            <h3>About Us</h3>
            <Link to="/environmental-responsibility">Environmental Responsibility</Link>
          </div>
          <div className="footer-column">
            <h3>Help Center</h3>
            <Link to="/account">My Account</Link>
            <Link to="/orders">My Orders</Link>
          </div>
          <div className="footer-column">
            <h3>About Amazon</h3>
            <Link to="/contact-amazon">Contact Amazon</Link>
          </div>
        </div>
        <div className="footer-copyright">
          ©1996-2026, Amazon.com, Inc. or its affiliates
        </div>
      </footer>
    </div>
  );
};

export default Mall;
