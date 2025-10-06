import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Menu, ShoppingCart, User, Search } from 'lucide-react';

type NavItem = { icon: React.ReactNode; label: string };

const navigationItems: NavItem[] = [
  { icon: <Menu className="w-6 h-6 text-x" />, label: 'Каталог' },
  { icon: <ShoppingCart className="w-6 h-6 text-x" />, label: 'Корзина' },
  { icon: <User className="w-6 h-6 text-x" />, label: 'Профиль' },
];

export const HeaderSection = (): JSX.Element => {
  return (
    <header className="w-full h-20 flex bg-ji-g-0o-i border-b border-[#c1c1c1]">
      <div className="flex items-center w-full max-w-[1280px] h-[46px] mx-auto px-4 gap-[88px]">
        <div className="relative w-fit bg-[linear-gradient(234deg,rgba(38,13,193,1)_0%,rgba(89,0,111,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-logo font-[number:var(--logo-font-weight)] text-transparent text-[length:var(--logo-font-size)] tracking-[var(--logo-letter-spacing)] leading-[var(--logo-line-height)] whitespace-nowrap [font-style:var(--logo-font-style)]">
          GLANCE
        </div>

        <div className="flex-1 max-w-[754px] h-10 relative">
          <div className="flex items-center gap-4 h-full px-4 bg-y-iy-2x-5 rounded-lg">
            <Search className="w-[18px] h-[18px] text-x flex-shrink-0" />
            <Input
              placeholder="Поиск"
              className="border-0 bg-transparent p-0 h-auto text-x"
            />
          </div>
        </div>

        <nav className="flex items-end gap-8">
          {navigationItems.map((item, index) => (
            <Button key={index} variant="ghost" className="flex flex-col items-center gap-2 h-auto p-0 hover:bg-transparent">
              {item.icon}
              <span className="text-x text-[14px] leading-none font-light">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};



