import React, { useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useGetCategoriesQuery } from '../../api/productsApi';

// Маппинг slug категорий на файлы иконок и отображаемые названия
const categoryData: Record<string, { icon: string; name: string }> = {
  'varochnye-paneli': { icon: '/icons/Варочные панели.png', name: 'Варочные панели' },
  'vinnye-shkafy': { icon: '/icons/Винные шкафы.png', name: 'Винные шкафы' },
  'vstraivaemye-kofemashiny': { icon: '/icons/Встраиваемые-кофемашины.png', name: 'Встраиваемые кофемашины' },
  'vytyazhki': { icon: '/icons/Вытяжки.png', name: 'Вытяжки' },
  'duhovye-shkafy': { icon: '/icons/Духовые шкафы.png', name: 'Духовые шкафы' },
  'klimaticheskoe-oborudovanie': { icon: '/icons/Климатическое-оборудование.png', name: 'Климатическое оборудование' },
  'mikrovolnovye-pechi': { icon: '/icons/микроволновые печи.png', name: 'Микроволновые печи' },
  'morozilnye-kamery': { icon: '/icons/Морозильные камеры.png', name: 'Морозильные камеры' },
  'posudomoechnye-mashiny': { icon: '/icons/Посудомоечные машины.png', name: 'Посудомоечные машины' },
  'stiralnye-mashiny': { icon: '/icons/Стиральные машины.png', name: 'Стиральные машины' },
  'sushilnye-mashiny': { icon: '/icons/Сушильные машины.png', name: 'Сушильные машины' },
  'holodilniki': { icon: '/icons/Холодильники.png', name: 'Холодильники' },
};

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
          <div className="flex items-start gap-4 w-full overflow-x-auto scrollbar-hide" ref={trackRef}>
            {categories?.map((category) => {
              const data = categoryData[category.slug];
              const displayName = data?.name || category.slug;
              const iconPath = data?.icon;
              
              return (
                <button 
                  key={category.id} 
                  className="flex flex-col items-center gap-3 flex-shrink-0"
                  onClick={() => { window.location.href = `/?chip=${encodeURIComponent(displayName)}`; }}
                >
                  <div className="w-[200px] h-[211px] bg-[#EEF1FF] rounded-[16px] border border-[#E7E7E7] grid place-items-center">
                    {iconPath ? (
                      <img 
                        src={iconPath} 
                        alt={displayName} 
                        className="w-[160px] h-[160px] object-contain"
                      />
                    ) : (
                      <div className="text-6xl opacity-30">📦</div>
                    )}
                  </div>
                  <span className="text-black text-xl font-light">{displayName}</span>
                </button>
              );
            })}
          </div>
        )}
        <button 
          className="absolute right-[80px] w-[52px] h-[52px] rounded-full bg-[#091D9E] shadow-lg flex items-center justify-center hover:bg-[#0a1a85] transition-colors"
          onClick={() => scroll(1)}
          aria-label="Следующая категория"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Заглушка для промо карточек — используем существующий PromoSection в Home */}
    </section>
  );
};



