import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from '../../features/catalog/catalogSlice';
import { selectCartCount } from '../../features/catalog/apiSelectors';
import { selectFavCount } from '../../features/catalog/apiSelectors';
import type { RootState } from '../../app/store';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';

const headerStyles = `
  .header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background:linear-gradient(180deg, rgba(26,26,26,.95), rgba(26,26,26,.9)); 
    border-bottom:1px solid #e5e7eb;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }

  .nav{
    display:grid; 
    grid-template-columns:1fr auto auto; 
    align-items:center; 
    gap:16px; 
    padding:14px 0
  }

  .brand{
    display:flex; 
    align-items:center; 
    gap:12px
  }

  .logo{
    width:40px; 
    height:40px; 
    border-radius:12px; 
    background: linear-gradient(135deg, #d4af37, #e6c34a);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    position: relative;
    overflow: hidden;
  }

  .logo::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #d4af37, #e6c34a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
  }

  .logo-tagline {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
    margin-left: 8px;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #374151, #1f2937);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: #ffffff;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .nav-button:hover {
    background: linear-gradient(135deg, #d4af37, #e6c34a);
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
  }

  .nav-button svg {
    width: 20px;
    height: 20px;
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  }

  .icon-emoji {
    font-size: 1.2rem;
    line-height: 1;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  /* Мобильные стили */
  @media (max-width: 768px) {
    .nav {
      grid-template-columns: 1fr auto;
      gap: 12px;
      padding: 12px 0;
    }

    .logo-text {
      font-size: 1.2rem;
    }

    .logo-tagline {
      display: none;
    }

    .nav-actions {
      gap: 12px;
    }

    .nav-button {
      width: 40px;
      height: 40px;
    }

    .nav-button svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    .nav {
      padding: 10px 0;
    }

    .logo-text {
      font-size: 1rem;
    }

    .nav-actions {
      gap: 8px;
    }

    .nav-button {
      width: 36px;
      height: 36px;
    }

    .nav-button svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export default function Header() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const favCount = useSelector(selectFavCount);
  
  // Добавляем стили в head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = headerStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Отладочная информация
  useEffect(() => {
    console.log('Header favCount:', favCount);
  }, [favCount]);
  
  // Принудительно очищаем избранное при первой загрузке
  useEffect(() => {
    const needsClearing = localStorage.getItem('needs_fav_clearing');
    if (!needsClearing) {
      console.log('Force clearing favorites and cart to fix React issues');
      localStorage.removeItem('techhome_favs');
      localStorage.removeItem('techhome_cart');
      localStorage.setItem('needs_fav_clearing', 'done');
      window.location.reload();
    }
  }, []);
  const { toggleFavorites } = useCatalogUrlActions();
  const favOnly = useSelector((s: RootState) => s.catalog.favoriteOnly);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <header className={`animated-header ${isVisible ? 'visible' : ''}`}>
      <div className="container nav" role="navigation" aria-label="Основная навигация">
        <div className="brand animated-brand">
          <Link to="/" aria-label="Перейти в каталог" className="brand-link">
            <div className="logo animated-logo" aria-hidden="true">
              <div className="logo-glow"></div>
              <div className="logo-particles">
                <div className="logo-particle particle-1"></div>
                <div className="logo-particle particle-2"></div>
                <div className="logo-particle particle-3"></div>
              </div>
            </div>
          </Link>
          <div className="title animated-title">
            <span className="title-main">🏪 TechnoFame</span>
            <small className="title-subtitle">✨ Премиальная бытовая техника</small>
          </div>
        </div>

        <div className="actions animated-actions">
          <button
            className="icon-btn animated-icon-btn"
            aria-label="Перейти к избранному"
            title="Избранные товары"
            onClick={() => {
              console.log('Navigating to favorites');
              window.location.href = "/?fav=1";
            }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>💖</span>
            {favCount > 0 && (
              <span className="badge animated-badge">
                <span className="badge-text">{favCount}</span>
                <div className="badge-glow"></div>
              </span>
            )}
            <div className="btn-ripple"></div>
          </button>

          <button
            className="icon-btn animated-icon-btn"
            title="Корзина"
            aria-label="Открыть корзину"
            onClick={() => dispatch(openDrawer())}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>🛒</span>
            {cartCount > 0 && (
              <span className="badge animated-badge cart-badge">
                <span className="badge-text">{cartCount}</span>
                <div className="badge-glow"></div>
              </span>
            )}
            <div className="btn-ripple"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
