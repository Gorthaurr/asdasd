import React, { useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useGetCategoriesQuery } from '../../api/productsApi';

export const ProductDisplaySection = (): JSX.Element => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { data: categories, isLoading } = useGetCategoriesQuery();
  
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current; if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="flex flex-col items-start gap-10 w-full px-20 py-10">
      {/* Каталог */}
      <div className="flex flex-col items-start gap-7 w-full">
        <div className="flex items-center justify-end gap-5">
          <h3 className="text-[32px]">Каталог</h3>
        </div>
        {isLoading ? (
          <div className="w-full text-center py-10 text-gray-500">Загрузка категорий...</div>
        ) : (
          <div className="flex items-start gap-4 w-full overflow-x-auto" ref={trackRef}>
            {categories?.map((category) => (
              <button 
                key={category.id} 
                className="flex flex-col items-center gap-3 flex-shrink-0"
                onClick={() => { window.location.href = `/?chip=${encodeURIComponent(category.name)}`; }}
              >
                <div className="w-[200px] h-[211px] bg-[#EEF1FF] rounded-[16px] border border-[#E7E7E7] grid place-items-center">
                  <img 
                    src={`/icons/${category.name}.png`} 
                    alt={category.name} 
                    className="w-[160px] h-[160px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-black text-xl font-light">{category.name}</span>
              </button>
            ))}
          </div>
        )}
        <Button variant="ghost" size="icon" className="absolute right-[80px] w-[52px] h-[52px] rounded-full bg-white shadow-lg">›</Button>
      </div>

      {/* Заглушка для промо карточек — используем существующий PromoSection в Home */}
    </section>
  );
};



