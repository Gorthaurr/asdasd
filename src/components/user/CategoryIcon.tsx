import React from 'react';
import './CategoryIcon.css';

interface CategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 'md' }) => {
  const getIconClass = () => {
    const baseClass = `category-icon category-icon-${size}`;
    return `${baseClass} category-icon-${category}`;
  };

  return (
    <div className={getIconClass()}>
      {category === 'холодильники' && (
        <div className="icon-symbol">❄</div>
      )}
      
      {category === 'варочные-панели' && (
        <div className="icon-symbol">🔥</div>
      )}
      
      {category === 'духовые-шкафы' && (
        <div className="icon-symbol">🍞</div>
      )}
      
      {category === 'стиральные-машины' && (
        <div className="icon-symbol">👕</div>
      )}
      
      {category === 'сушильные-машины' && (
        <div className="icon-symbol">🌞</div>
      )}
      
      {category === 'посудомоечные-машины' && (
        <div className="icon-symbol">🍽️</div>
      )}
      
      {category === 'вытяжки' && (
        <div className="icon-symbol">💨</div>
      )}
      
      {category === 'морозильные-камеры' && (
        <div className="icon-symbol">🧊</div>
      )}
      
      {category === 'микроволновые-печи' && (
        <div className="icon-symbol">⚡</div>
      )}
      
      {category === 'винные-шкафы' && (
        <div className="icon-symbol">🍷</div>
      )}
      
      {category === 'встраиваемые-кофемашины' && (
        <div className="icon-symbol">☕</div>
      )}
      
      {category === 'климатическое-оборудование' && (
        <div className="icon-symbol">🌡️</div>
      )}
      
      {category === 'all' && (
        <div className="icon-symbol">🏠</div>
      )}
    </div>
  );
};

export default CategoryIcon;

