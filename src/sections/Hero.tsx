// Промо-блок: второй поиск, селект сортировки, чипсы категорий
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useCatalogUrlActions } from '../routing/useCatalogUrlActions';
import ChipsApi from '../components/controls/ChipsApi';
import { Portal } from '../components/common/Portal';
import type { RootState } from '../app/store';

const heroStyles = `
  .hero-card{
    background:linear-gradient(145deg, #1a1a1a, #0f0f0f); 
    border:1px solid #e5e7eb; 
    border-radius:24px; 
    padding:32px; 
    position:relative; 
    overflow:visible; 
    display:flex; 
    flex-direction:column; 
    gap: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    backdrop-filter: blur(10px);
  }

  .hero-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
    border-radius: 24px;
    pointer-events: none;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0;
    text-align: center;
  }

  .hero-title .title-line {
    display: block;
    background: linear-gradient(135deg, #1f2937 0%, #c0c0c0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-title .highlight {
    background: linear-gradient(135deg, #d4af37 0%, #e6c34a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(212, 175, 55, 0.3);
  }

  .hero-description{
    max-width: 70%; 
    display: flex; 
    flex-direction: column; 
    gap: 8px; 
    margin: 16px auto 24px;
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.5;
    color: #6b7280;
  }

  .description-line{
    display: block; 
    line-height: 1.5;
  }

  .hero-stats{
    display:flex; 
    flex-direction:row; 
    justify-content:center; 
    align-items:center; 
    gap: 48px; 
    margin-top: 24px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(230, 195, 74, 0.05));
    border-radius: 16px;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  .search-row{
    display:flex; 
    flex-wrap:wrap; 
    gap:16px; 
    margin:24px auto; 
    align-items: center; 
    justify-content: center;
    position: relative; 
    z-index: 2;
    max-width: 800px;
  }

  .search{
    flex:1 1 400px; 
    max-width: 500px;
    display:flex; 
    align-items:center; 
    gap:8px; 
    background:#ffffff; 
    padding:12px 16px; 
    border-radius:16px; 
    border:1px solid #e5e7eb;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .search:hover {
    border-color: #d4af37;
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2);
  }

  .search input, select{
    background:transparent; 
    color:#1f2937; 
    border:0; 
    outline:none;
    font-size: 1rem;
    font-weight: 500;
  }

  .select{
    min-width:200px; 
    max-width: 250px;
    background:#ffffff; 
    border:1px solid #e5e7eb; 
    border-radius:16px; 
    padding:12px 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .select:hover {
    border-color: #d4af37;
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2);
  }

  .stat{
    background:linear-gradient(180deg, #1a1a1a, #0f0f0f); 
    border:1px solid #e5e7eb; 
    border-radius:20px; 
    padding:18px; 
    display:flex; 
    justify-content:center; 
    align-items:center; 
    gap:24px; 
    flex-wrap:wrap; 
    max-width:600px; 
    margin:0 auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }

  .stat-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 900;
    color: #d4af37;
    text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
  }

  .stat-label {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  
  /* Секция преимуществ */
  .hero-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 32px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(230, 195, 74, 0.02));
    border-radius: 16px;
    border: 1px solid rgba(212, 175, 55, 0.1);
  }
  
  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .feature-item:hover {
    background: rgba(212, 175, 55, 0.1);
    transform: translateY(-2px);
  }
  
  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #d4af37, #e6c34a);
    border-radius: 50%;
    font-size: 1.5rem;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }
  
  .feature-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  
  .feature-description {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.4;
    margin: 0;
  }

  .back-to-categories {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(230, 195, 74, 0.05));
    border-radius: 12px;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: transparent;
    border: 1px solid #d4af37;
    border-radius: 8px;
    color: #d4af37;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .back-btn:hover {
    background: #d4af37;
    color: #ffffff;
    transform: translateX(-2px);
  }

  .current-category {
    margin-left: auto;
  }

  .category-badge {
    display: inline-block;
    padding: 6px 12px;
    background: linear-gradient(135deg, #d4af37, #e6c34a);
    color: #ffffff;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
  }

  /* Мобильные стили */
  @media (max-width: 1200px) {
    .hero-features {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }

  @media (max-width: 768px) {
    .hero-card{gap: 16px; padding: 24px;}
    .hero-title { font-size: 2.8rem; }
    .hero-description{max-width: 100%;}
    .hero-stats{flex-direction: column; gap: 16px; align-items: center;}
    .hero-features { 
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 16px;
    }
  }

  @media (max-width: 480px) {
    .hero-title { font-size: 2.2rem; }
    .hero-card { padding: 20px; }
    .hero-stats { gap: 12px; padding: 16px; }
    .hero-features { 
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 12px;
    }
  }

  @media (max-width: 360px) {
    .hero-title { font-size: 1.8rem; }
    .hero-card { padding: 16px; }
    .hero-stats { 
      flex-direction: column;
      gap: 8px;
      padding: 12px;
    }
    .hero-features {
      grid-template-columns: 1fr;
      gap: 8px;
      padding: 8px;
    }
  }
`;


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
    const { setQ, setSort, setChip } = useCatalogUrlActions(); // используем URL-действия
    const q = useSelector((s:RootState)=>s.catalog.q); // строка поиска из стора
    const sort = useSelector((s:RootState)=>s.catalog.sort); // текущая сортировка
    const selectedCategory = useSelector((s:RootState)=>s.catalog.chip); // выбранная категория
    const [isVisible, setIsVisible] = useState(false);

    // Показываем ли кнопку "Вернуться к категориям"
    const showBackToCategories = selectedCategory && selectedCategory !== 'Все';

    // Добавляем стили в head
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = heroStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

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

                {showBackToCategories && (
                    <div className="back-to-categories">
                        <button
                            className="btn secondary back-btn"
                            onClick={() => setChip('Все')}
                            aria-label="Вернуться к каталогу категорий"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Вернуться к категориям
                        </button>
                        <div className="current-category">
                            <span className="category-badge">{selectedCategory}</span>
                        </div>
                    </div>
                )}
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