// Промо-блок: второй поиск, селект сортировки, чипсы категорий
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import ChipsApi from '../components/controls/ChipsApi';
import { Portal } from '../components/common/Portal';
import type { RootState } from '../app/store';


// Анимированный селект сортировки
function AnimatedSortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = useMemo(() => [
        { value: 'popular', label: '🔥 Сначала популярные' },
        { value: 'priceAsc', label: '💰 Цена: по возрастанию' },
        { value: 'priceDesc', label: '💎 Цена: по убыванию' },
        { value: 'new', label: '✨ Новинки' },
        { value: 'nameAsc', label: '🔤 Название: А-Я' },
        { value: 'nameDesc', label: '🔡 Название: Я-А' },
        { value: 'rating', label: '⭐ По рейтингу' },
        { value: 'discount', label: '🏷️ Со скидкой' }
    ], []);

    // Обновляем позицию dropdown при открытии и прокрутке
    useEffect(() => {
        if (isOpen && selectRef.current) {
            const updatePosition = () => {
                const rect = selectRef.current?.getBoundingClientRect();
                if (rect) {
                    setDropdownPosition({
                        top: rect.bottom,
                        left: rect.left,
                        width: rect.width
                    });
                }
            };

            // Обновляем позицию сразу
            updatePosition();

            // Добавляем обработчики для обновления позиции при прокрутке и изменении размера окна
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
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

    // Обработка клавиши Escape и прокрутки
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            // Закрываем dropdown при прокрутке, если он открыт
            if (isOpen) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll);
        };
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
        onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Обработка клавиш
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Обработка нажатий клавиш
    };

    const handleClear = () => {
        onChange('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
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
                onKeyDown={handleKeyDown}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                type="text"
                placeholder="Поиск товаров..."
                autoComplete="off"
                aria-label="Поиск по товарам"
            />
            {value && (
                <button
                    type="button"
                    className="search-clear"
                    onClick={handleClear}
                    aria-label="Очистить поиск"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path 
                            d="M18 6L6 18M6 6l12 12" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            )}
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
                <h1 className="hero-title">
                    <span className="title-line">Премиальная техника</span>
                    <span className="title-line highlight">для вашего дома</span>
                </h1>
                <p className="hero-description">
                    <span className="description-line">Бытовая, цифровая, садовая и аудио техника широкого сегмента</span>
                    <span className="description-line">от ведущих мировых производителей. Умные фильтры, быстрый поиск, корзина и избранное — всё в одном месте.</span>
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
                <ChipsApi />
                <div className="hero-stats">
                    <div className="stat-row">
                        <strong className="stat-number">⭐ 4.9/5</strong>
                        <span className="stat-label">📊 по оценкам покупателей</span>
                    </div>
                    <div className="stat-row">
                        <strong className="stat-number">🕐 24/7</strong>
                        <span className="stat-label">📞 поддержка клиентов</span>
                    </div>
                    <div className="stat-row">
                        <strong className="stat-number">🔄 365</strong>
                        <span className="stat-label">📅 дней возврата</span>
                    </div>
                    <div className="stat-row">
                        <strong className="stat-number">🏆 10+</strong>
                        <span className="stat-label">🎯 лет опыта</span>
                    </div>
                </div>
                
                <div className="hero-features">
                    <div className="feature-item">
                        <div className="feature-icon">
                            ✅
                        </div>
                        <div className="feature-content">
                            <h4 className="feature-title">🛡️ Гарантия качества</h4>
                            <p className="feature-description">Вся техника с официальной гарантией, в заводской упаковке</p>
                        </div>
                    </div>
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            ⭐
                        </div>
                        <div className="feature-content">
                            <h4 className="feature-title">🏅 Премиальные бренды</h4>
                            <p className="feature-description">Сотрудничаем со всеми мировыми производителями</p>
                        </div>
                    </div>
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            📦
                        </div>
                        <div className="feature-content">
                            <h4 className="feature-title">🛍️ Широкий ассортимент</h4>
                            <p className="feature-description">Тысячи товаров от ведущих производителей электроники</p>
                        </div>
                    </div>
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
        </section>
    );
}