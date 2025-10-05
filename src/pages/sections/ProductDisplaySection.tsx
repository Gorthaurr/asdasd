import React, { useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const categoryItems = [
  { image: '/icons/Смартфоны.png', label: 'Смартфоны' },
  { image: '/icons/Ноутбуки.png', label: 'Ноутбуки' },
  { image: '/icons/Компьютеры.png', label: 'Компьютеры' },
  { image: '/icons/Телевизоры.png', label: 'Телевизоры' },
  { image: '/icons/Планшеты.png', label: 'Планшеты' },
  { image: '/icons/Колонки.png', label: 'Колонки' },
];

export const ProductDisplaySection = (): JSX.Element => {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current; if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="flex flex-col items-start gap-10 w-full px-20 py-0">
      {/* Hero banner */}
      <div className="relative w-full h-[260px] bg-black rounded-lg overflow-hidden">
        <div className="flex flex-col w-[34%] items-start gap-5 absolute top-[12%] left-[19%]">
          <h2 className="text-white text-[40px]">Умная колонка</h2>
          <p className="text-[32px]"><span className="text-[#EBBA1A]">СКИДКА 30%</span><span className="text-[#DEDDDD]"> при покупке второго товара</span></p>
        </div>
      </div>

      {/* Каталог */}
      <div className="flex flex-col items-start gap-7 w-full">
        <div className="flex items-center justify-end gap-5">
          <h3 className="text-[32px]">Каталог</h3>
        </div>
        <div className="flex items-start gap-4 w-full overflow-x-auto" ref={trackRef}>
          {categoryItems.map((item, idx) => (
            <button key={idx} className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="w-[200px] h-[211px] bg-[#EEF1FF] rounded-[16px] border border-[#E7E7E7] grid place-items-center">
                <img src={item.image} alt={item.label} className="w-[160px] h-[160px] object-contain" />
              </div>
              <span className="text-black text-xl font-light">{item.label}</span>
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="absolute right-[80px] w-[52px] h-[52px] rounded-full bg-white shadow-lg">›</Button>
      </div>

      {/* Заглушка для промо карточек — используем существующий PromoSection в Home */}
    </section>
  );
};


