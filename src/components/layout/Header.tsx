import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from '../../features/catalog/catalogSlice';
import { selectCartCount } from '../../features/catalog/apiSelectors';
import { selectFavCount } from '../../features/catalog/apiSelectors';
import type { RootState } from '../../app/store';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';
import { useGetProductsQuery } from '../../api/productsApi';
import { Search, Menu, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const favCount = useSelector(selectFavCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { setQ } = useCatalogUrlActions();

  // Debounce для запроса поиска
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Запрос для поиска товаров
  const { data: searchResults } = useGetProductsQuery({
    q: debouncedQuery,
    page_size: 5,
    include_images: true,
    include_attributes: false
  }, {
    skip: !debouncedQuery.trim() || debouncedQuery.length < 2
  });

  // Закрытие выпадашки при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full h-20 flex bg-white relative">
      {/* Бордер на весь экран */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-[#c1c1c1]"
        style={{
          left: 0,
          right: 0,
          transform: 'translateY(1px)',
          width: '100vw',
          position: 'absolute'
        }}
      />
      <div className="flex items-center w-full max-w-[1280px] h-[46px] mx-auto px-4 gap-[88px] mt-[17px]">
        <Link to="/" className="relative w-fit bg-[linear-gradient(234deg,rgba(38,13,193,1)_0%,rgba(89,0,111,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-logo font-[number:var(--logo-font-weight)] text-transparent text-[length:var(--logo-font-size)] tracking-[var(--logo-letter-spacing)] leading-[var(--logo-line-height)] whitespace-nowrap [font-style:var(--logo-font-style)]">
          TECHOFAME
        </Link>

        <div className="flex-1 max-w-[754px]" ref={searchRef}>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                setQ(searchQuery.trim());
                setShowSuggestions(false);
              }
            }}
          >
            <label className="flex items-center gap-4 h-10 px-4 bg-y-iy-2x-5 rounded-lg relative">
              <Search className="w-[18px] h-[18px] text-x flex-shrink-0" aria-hidden="true" />
              <input
                className="border-0 bg-transparent p-0 h-auto text-x w-full outline-none"
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </label>
          </form>

          {/* Выпадашка с результатами поиска */}
          {showSuggestions && debouncedQuery.length >= 2 && searchResults?.items && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {searchResults.items.slice(0, 5).map((product) => (
                <button
                  key={product.id}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  onClick={() => {
                    setQ(product.name);
                    setShowSuggestions(false);
                    setSearchQuery('');
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {product.price_raw && `от ${product.price_raw}`}
                    </div>
                  </div>
                </button>
              ))}
              {searchResults.items.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">Ничего не найдено</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-8">
          <button className="flex flex-col items-center gap-1 text-x hover:text-x-9g-itj-q transition-colors" onClick={() => { window.location.href = "/?chip=Все"; }} aria-label="Каталог">
            <Menu className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-sm font-light">Каталог</span>
          </button>
          <button className="relative flex flex-col items-center gap-1 text-x hover:text-x-9g-itj-q transition-colors" onClick={() => dispatch(openDrawer())} aria-label="Корзина">
            <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-sm font-light">Корзина</span>
            {cartCount > 0 && <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-x-9g-itj-q text-white text-[11px] leading-[18px] text-center">{cartCount}</span>}
          </button>
          <button className="flex flex-col items-center gap-1 text-x hover:text-x-9g-itj-q transition-colors" aria-label="Профиль">
            <User className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-sm font-light">Профиль</span>
          </button>
        </div>
      </div>
    </header>
  );
}
