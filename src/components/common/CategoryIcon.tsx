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
  // Жесткий меппинг категорий к иконкам
  const categoryIconMap: { [key: string]: string } = {
    'все': '/icons/favicon.png', // Используем favicon для "Все"
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
      width={size}
      height={size}
      className={`category-icon ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
      }}
      onError={(e) => {
        // Fallback на эмодзи если иконка не загрузилась
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        if (target.parentElement) {
          target.parentElement.innerHTML = getEmojiFallback(categorySlug);
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
