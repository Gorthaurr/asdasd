// Промо-блок: второй поиск, селект сортировки, чипсы категорий
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import Chips from '../components/controls/Chips';
import { Portal } from '../components/common/Portal';
import type { RootState } from '../app/store';


// Анимированный селект сортировки
function AnimatedSortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = useMemo(() => [
        { value: 'popular', label: 'Сначала популярные' },
        { value: 'priceAsc', label: 'Цена: по возрастанию' },
        { value: 'priceDesc', label: 'Цена: по убыванию' },
        { value: 'new', label: 'Новинки' },
        { value: 'nameAsc', label: 'Название: А-Я' },
        { value: 'nameDesc', label: 'Название: Я-А' },
        { value: 'rating', label: 'По рейтингу' },
        { value: 'discount', label: 'Со скидкой' }
    ], []);

    // Обновляем позицию dropdown при открытии
    useEffect(() => {
        if (isOpen && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
        }
    }, [isOpen]);

    // Обработка кликов вне селекта
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isClickInsideSelect = selectRef.current?.contains(target);
            const isClickInsideDropdown = dropdownRef.current?.contains(target);
            
            if (!isClickInsideSelect && !isClickInsideDropdown) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Обработка клавиши Escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const handleOptionClick = useCallback((optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    }, [onChange]);

    const selectedOptionLabel = useMemo(() => {
        return options.find(option => option.value === value)?.label || 'Сортировка';
    }, [value, options]);

    return (
        <div className={`animated-select ${isOpen ? 'focused' : ''}`} ref={selectRef}>
            <button
                className={`select-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Сортировка"
                type="button"
            >
                <span>{selectedOptionLabel}</span>
                <svg 
                    className={`arrow ${isOpen ? 'rotate' : ''}`} 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24"
                >
                    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
            </button>
            
            {isOpen && (
                <Portal ref={dropdownRef}>
                    <div
                        className="select-dropdown-portal"
                        style={{
                            position: 'fixed',
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: dropdownPosition.width,
                            zIndex: 999999,
                        }}
                        data-portal-dropdown="true"
                    >
                        <div className="select-dropdown-content">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    className={`select-option ${value === option.value ? 'active' : ''}`}
                                    onClick={() => handleOptionClick(option.value)}
                                    type="button"
                                    role="option"
                                    aria-selected={value === option.value}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
}

// Анимированное поле поиска
function AnimatedSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Разрешаем пробелы, но убираем лишние в начале и конце
        const newValue = e.target.value;
        onChange(newValue);
    };

    return (
        <div className={`animated-search ${isFocused ? 'focused' : ''}`}>
            <div className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path 
                        d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            <input
                ref={inputRef}
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                type="search"
                placeholder="Поиск товаров..."
                autoComplete="off"
                aria-label="Поиск по товарам"
            />
            <div className="search-ripple"></div>
        </div>
    );
}


export default function Hero(){
    const { setQ, setSort } = useCatalogUrlActions(); // используем URL-действия
    const q = useSelector((s:RootState)=>s.catalog.q); // строка поиска из стора
    const sort = useSelector((s:RootState)=>s.catalog.sort); // текущая сортировка
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className={`hero animated-hero ${isVisible ? 'visible' : ''}`} aria-label="Промо">
            <div className="hero-card">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="title-line">Техника, которая</span>
                        <span className="title-line highlight">упрощает жизнь</span>
                    </h1>
                    <p className="hero-description">
                        Выбирайте из сотен товаров: от кухонных помощников до климат‑систем. 
                        Умные фильтры, быстрый поиск, корзина и избранное — всё в одном месте.
                    </p>
                    <div className="search-row">
                        <AnimatedSearch 
                            value={q} 
                            onChange={(value) => setQ(value)} 
                        />
                        <AnimatedSortSelect 
                            value={sort} 
                            onChange={(value) => setSort(value)} 
                        />
                    </div>
                    <Chips />
                </div>
                <div className="hero-background">
                    <div className="floating-shapes">
                        <div className="shape shape-1"></div>
                        <div className="shape shape-2"></div>
                        <div className="shape shape-3"></div>
                        <div className="shape shape-4"></div>
                    </div>
                </div>
            </div>
            {/* Блок доверия/статистики */}
            <div className="stat" aria-label="Качество сервиса">
                <div className="stat-content">
                    <div className="stat-row">
                        <strong className="stat-number">4.9/5</strong>
                        <span className="stat-label">по оценкам покупателей</span>
                    </div>
                    <div className="stat-row">
                        <strong className="stat-number">24/7</strong>
                        <span className="stat-label">поддержка</span>
                        <span className="stat-separator">•</span>
                        <strong className="stat-number">365</strong>
                        <span className="stat-label">дней возврата</span>
                    </div>
                </div>
            </div>
        </section>
    );
}