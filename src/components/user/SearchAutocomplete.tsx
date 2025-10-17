import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setQ } from '../../features/catalog/catalogSlice';
import type { Product } from '../../types/product';
import './SearchAutocomplete.css';

interface SearchAutocompleteProps {
  products?: Product[];
  placeholder?: string;
}

interface SearchSuggestion {
  title: string;
  subtitle?: string;
  query: string;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  products = [],
  placeholder = "Поиск товаров..."
}) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Генерируем предложения на основе запроса
  const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
    const q = searchQuery.toLowerCase().trim();
    const suggestions: SearchSuggestion[] = [];

    if (q.length === 0) {
      // Показываем популярные товары без ввода
      const popularProducts = products
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);

      popularProducts.forEach(product => {
        suggestions.push({
          title: product.name,
          subtitle: `${product.brand || product.category} • ${product.price.toLocaleString()} ₽`,
          query: product.name
        });
      });
    } else {
      // Поиск по товарам при вводе
      const productMatches = products
        .filter(product => 
          product.name.toLowerCase().includes(q) ||
          (product.brand && product.brand.toLowerCase().includes(q)) ||
          product.category.toLowerCase().includes(q)
        )
        .slice(0, 8);

      productMatches.forEach(product => {
        suggestions.push({
          title: product.name,
          subtitle: `${product.brand || product.category} • ${product.price.toLocaleString()} ₽`,
          query: product.name
        });
      });
    }

    return suggestions;
  };

  // Обработка изменений в поле ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    setIsLoading(true);
    setTimeout(() => {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setIsOpen(newSuggestions.length > 0);
      setIsLoading(false);
      setSelectedIndex(-1);
    }, value.length === 0 ? 0 : 150);
  };

  // Выбор предложения
  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.query);
    setIsOpen(false);
    dispatch(setQ(suggestion.query));
    inputRef.current?.blur();
  };

  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      dispatch(setQ(query));
    }
  };

  // Очистка поля
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    dispatch(setQ(''));
    inputRef.current?.focus();
  };

  // Навигация с клавиатуры
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else if (query.trim()) {
          dispatch(setQ(query));
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Прокрутка к выбранному элементу
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="search-autocomplete">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setIsOpen(true);
              } else {
                const newSuggestions = generateSuggestions('');
                setSuggestions(newSuggestions);
                setIsOpen(newSuggestions.length > 0);
              }
            }}
            placeholder={placeholder}
            className="search-input"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              aria-label="Очистить поиск"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
      </form>

      {isOpen && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="suggestions-dropdown">
          <div className="suggestions-header">
            <span>{query.trim() === '' ? 'Популярные товары' : 'Предложения'}</span>
            <span className="suggestions-count">{suggestions.length}</span>
          </div>
          
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="suggestion-content">
                  <div className="suggestion-title">
                    {highlightMatch(suggestion.title, query)}
                  </div>
                  {suggestion.subtitle && (
                    <div className="suggestion-subtitle">
                      {suggestion.subtitle}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="suggestions-footer">
            <span className="suggestions-hint">
              Используйте ↑↓ для навигации, Enter для выбора
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Подсветка совпадений в тексте
const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="highlight">{part}</mark>
    ) : (
      part
    )
  );
};

export default SearchAutocomplete;

