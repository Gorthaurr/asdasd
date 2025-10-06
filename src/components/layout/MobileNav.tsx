import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openDrawer } from '../../features/catalog/catalogSlice';
import { selectCartCount } from '../../features/catalog/apiSelectors';

export default function MobileNav() {
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-[#e5e7eb]">
      <div className="w-full">
        <div className="grid grid-cols-4 h-16 items-center text-xs text-x">
          <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-x-9g-itj-q' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Главная</span>
          </Link>

          <button className="flex flex-col items-center gap-1" onClick={() => window.location.href = '/?chip=Все'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Каталог</span>
          </button>

          <button className="relative flex flex-col items-center gap-1" onClick={() => dispatch(openDrawer())}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 right-[28%] min-w-5 h-5 px-1 rounded-full bg-x-9g-itj-q text-white text-[10px] leading-5 text-center">{cartCount}</span>
            )}
          </button>

          <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-x-9g-itj-q' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Профиль</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
