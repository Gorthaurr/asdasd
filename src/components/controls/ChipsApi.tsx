// Чипсы категорий с API
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetCategoriesQuery } from '../../api/productsApi';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';
import type { RootState } from '../../app/store';

export default function ChipsApi() {
    const { setChip } = useCatalogUrlActions(); // используем URL-действия
    const chip = useSelector((s: RootState) => s.catalog.chip); // выбранная категория
    const [isVisible, setIsVisible] = useState(false);

    // Запрос категорий из API
    const { data: categories = [], isLoading } = useGetCategoriesQuery();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Добавляем "Все" в начало списка категорий
    const allCategories = ['Все', ...categories.map((cat: any) => cat.slug)];

    if (isLoading) {
        return (
            <div className="chips animated-chips visible" id="chips" aria-label="Категории">
                <div className="loading-chips">
                    <div className="loading-spinner"></div>
                    <span>Загружаем категории...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`chips animated-chips ${isVisible ? 'visible' : ''}`} id="chips" aria-label="Категории">
            {allCategories.map((c, index) => (
                <button 
                    key={c} 
                    className={`chip animated-chip ${c === chip ? ' is-active' : ''}`} 
                    aria-pressed={c === chip} 
                    onClick={() => setChip(c)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <span className="chip-text">{c}</span>
                    <div className="chip-ripple"></div>
                    <div className="chip-glow"></div>
                </button>
            ))}
        </div>
    );
}
