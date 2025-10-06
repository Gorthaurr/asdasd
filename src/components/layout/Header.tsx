import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openDrawer } from '../../features/catalog/catalogSlice';
import { selectCartCount } from '../../features/catalog/apiSelectors';
import { selectFavCount } from '../../features/catalog/apiSelectors';
import type { RootState } from '../../app/store';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';
import { Search, Menu, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const favCount = useSelector(selectFavCount);

  return (
    <header className="w-full h-20 flex bg-white" style={{ borderBottom: '1px solid #c1c1c1', boxShadow: '0 1px 0 0 #c1c1c1' }}>
      <div className="flex items-center w-full max-w-[1280px] h-[46px] mx-auto px-4 gap-[88px] mt-[17px]">
        <Link to="/" className="relative w-fit bg-[linear-gradient(234deg,rgba(38,13,193,1)_0%,rgba(89,0,111,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-logo font-[number:var(--logo-font-weight)] text-transparent text-[length:var(--logo-font-size)] tracking-[var(--logo-letter-spacing)] leading-[var(--logo-line-height)] whitespace-nowrap [font-style:var(--logo-font-style)]">
          TECHOFAME
        </Link>

        <form className="flex-1 max-w-[754px] h-10" role="search">
          <label className="flex items-center gap-4 h-full px-4 bg-y-iy-2x-5 rounded-lg">
            <Search className="w-[18px] h-[18px] text-x flex-shrink-0" aria-hidden="true" />
            <input className="border-0 bg-transparent p-0 h-auto text-x w-full outline-none" type="text" placeholder="Поиск" />
          </label>
        </form>

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
