import React, { useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useGetCategoriesQuery } from '../../api/productsApi';

// Маппинг русских slug (с дефисами) из БД на отображаемые названия и иконки из папки icons
const categoryData: Record<string, { name: string; icon: string }> = {
  'холодильники': { name: 'Холодильники', icon: '/icons/Холодильники.png' },
  'варочные-панели': { name: 'Варочные панели', icon: '/icons/Варочные панели.png' },
  'духовые-шкафы': { name: 'Духовые шкафы', icon: '/icons/Духовые шкафы.png' },
  'стиральные-машины': { name: 'Стиральные машины', icon: '/icons/Стиральные машины.png' },
  'сушильные-машины': { name: 'Сушильные машины', icon: '/icons/Сушильные машины.png' },
  'посудомоечные-машины': { name: 'Посудомоечные машины', icon: '/icons/Посудомоечные машины.png' },
  'вытяжки': { name: 'Вытяжки', icon: '/icons/Вытяжки.png' },
  'морозильные-камеры': { name: 'Морозильные камеры', icon: '/icons/Морозильные камеры.png' },
  'микроволновые-печи': { name: 'Микроволновые печи', icon: '/icons/микроволновые печи.png' },
  'винные-шкафы': { name: 'Винные шкафы', icon: '/icons/Винные шкафы.png' },
  'встраиваемые-кофемашины': { name: 'Встраиваемые кофемашины', icon: '/icons/Встраиваемые-кофемашины.png' },
  'климатическое-оборудование': { name: 'Климатическое оборудование', icon: '/icons/Климатическое-оборудование.png' },
};

export const ProductDisplaySection = (): JSX.Element => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);
  
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current; if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    
    const isAtStart = el.scrollLeft <= 10;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    
    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  };

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    
    el.addEventListener('scroll', handleScroll);
    handleScroll(); // Проверяем начальное состояние
    
    return () => el.removeEventListener('scroll', handleScroll);
  }, [categories]);

  return (
    <section className="flex flex-col items-start gap-10 w-full px-20 py-10">
      {/* Каталог */}
      <div className="flex flex-col items-start gap-7 w-full relative">
        <div className="flex items-center justify-end gap-5">
          <h3 className="text-[32px]">Каталог</h3>
        </div>
        {isLoading ? (
          <div className="w-full text-center py-10 text-gray-500">Загрузка категорий...</div>
        ) : (
          <>
            <div className="flex items-start gap-4 w-full overflow-x-auto scrollbar-hide" ref={trackRef}>
            {categories?.map((category) => {
              // Берём данные по латинскому slug из БД
              const data = categoryData[category.slug];
              const displayName = data?.name || category.slug;
              const iconPath = data?.icon;
              
              return (
                <button 
                  key={category.id} 
                  className="category-card flex flex-col items-center gap-3 flex-shrink-0"
                  onClick={() => { window.location.href = `/?chip=${encodeURIComponent(displayName)}`; }}
                >
                  <div className="w-[200px] h-[211px] bg-[#EEF1FF] rounded-[16px] border border-[#BCC5FF] grid place-items-center overflow-hidden">
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
                  <span className="category-name text-black text-xl font-light text-center">{displayName}</span>
                </button>
              );
            })}
          </div>
          
          {/* Кнопки навигации карусели */}
          {showLeftArrow && (
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full bg-[#091D9E] shadow-lg flex items-center justify-center hover:bg-[#0a1a85] transition-all z-10"
              onClick={() => scroll(-1)}
              aria-label="Предыдущая категория"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
          
          {showRightArrow && (
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full bg-[#091D9E] shadow-lg flex items-center justify-center hover:bg-[#0a1a85] transition-all z-10"
              onClick={() => scroll(1)}
              aria-label="Следующая категория"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
          </>
        )}
      </div>

      {/* Заглушка для промо карточек — используем существующий PromoSection в Home */}
    </section>
  );
};



