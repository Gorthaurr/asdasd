import React from 'react';

interface CategoryIconProps {
  categorySlug: string;
  size?: number;
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  categorySlug, 
  size = 24, 
  className = '' 
}) => {
  // Жесткий меппинг категорий к иконкам (точные имена файлов)
  const categoryIconMap: { [key: string]: string } = {
    'все': '/icons/favicon.png',
    'холодильники': '/icons/Холодильники.png',
    'стиральные-машины': '/icons/Стиральные машины.png',
    'посудомоечные-машины': '/icons/Посудомоечные машины.png',
    'духовые-шкафы': '/icons/Духовые шкафы.png',
    'сушильные-машины': '/icons/Сушильные машины.png',
    'вытяжки': '/icons/Вытяжки.png',
    'морозильные-камеры': '/icons/Морозильные камеры.png',
    'микроволновые-печи': '/icons/микроволновые печи.png',
    'винные-шкафы': '/icons/Винные шкафы.png',
    'встраиваемые-кофемашины': '/icons/Встраиваемые-кофемашины.png',
    'климатическое-оборудование': '/icons/Климатическое-оборудование.png',
    'варочные-панели': '/icons/Варочные панели.png',
  };

  const iconPath = categoryIconMap[categorySlug.toLowerCase()] || '/icons/favicon.png';

  return (
    <img
      src={iconPath}
      alt={categorySlug}
      className={`category-icon-img ${className}`}
      style={
        // Для маленьких иконок (в карточках продуктов, чипсах) - фиксируем размер
        // Для больших (в категориях) - пусть CSS растягивает
        size <= 100 ? {
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'inline-block',
        } : undefined
      }
      onError={(e) => {
        console.log(`Failed to load icon for category: ${categorySlug}, path: ${iconPath}`);
        // Fallback на эмодзи если иконка не загрузилась
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        if (target.parentElement) {
          const emoji = getEmojiFallback(categorySlug);
          target.parentElement.innerHTML = `<span style="font-size: ${size}px; display: inline-block; vertical-align: middle;">${emoji}</span>`;
        }
      }}
    />
  );
};

// Функция для получения эмодзи fallback
const getEmojiFallback = (categorySlug: string): string => {
  const emojiMap: { [key: string]: string } = {
    'все': '🏠',
    'холодильники': '❄️',
    'стиральные-машины': '🌀',
    'посудомоечные-машины': '🍽️',
    'духовые-шкафы': '🥧',
    'сушильные-машины': '🌪️',
    'вытяжки': '💨',
    'морозильные-камеры': '🧊',
    'микроволновые-печи': '📡',
    'винные-шкафы': '🍷',
    'встраиваемые-кофемашины': '☕',
    'климатическое-оборудование': '❄️',
    'варочные-панели': '🔥',
  };

  return emojiMap[categorySlug.toLowerCase()] || '📦';
};

export default CategoryIcon;
