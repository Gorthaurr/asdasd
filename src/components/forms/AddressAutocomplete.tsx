// Простой компонент автодополнения адресов
import { useState, useRef, useCallback } from 'react';
import { useGetAddressSuggestionsQuery } from '../../api/addressApi';

interface AddressSuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    postal_code?: string;
    country: string;
    region?: string;
    city?: string;
    street?: string;
    house?: string;
    flat?: string;
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Начните вводить адрес...",
  required = false,
  id,
  className = '',
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Запрос к API (только если есть текст)
  const { data: suggestions = [], isLoading } = useGetAddressSuggestionsQuery(
    { query: value, count: 10 },
    {
      skip: value.length < 1, // Не делаем запрос для пустого значения
    }
  );

  // Обработка выбора подсказки
  const handleSuggestionSelect = useCallback((suggestion: AddressSuggestion) => {
    onChange(suggestion.value);
    onAddressSelect?.(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, [onChange, onAddressSelect]);

  // Обработка клавиш
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, selectedIndex, handleSuggestionSelect]);

  return (
    <div className="address-autocomplete" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(e.target.value.length >= 1);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className={`address-input ${className}`}
        autoComplete="off"
      />

      {isLoading && (
        <div className="address-loading" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderTop: 'none',
          padding: '8px 12px',
          fontSize: '14px',
          color: '#666'
        }}>
          🔄 Поиск адресов...
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="address-suggestions" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderTop: 'none',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid #eee' : 'none',
                backgroundColor: index === selectedIndex ? '#f0f8ff' : 'white'
              }}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              📍 {suggestion.value}
              {suggestion.data.postal_code && (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  📮 {suggestion.data.postal_code}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOpen && !isLoading && suggestions.length === 0 && value.length >= 1 && (
        <div className="address-no-results" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderTop: 'none',
          padding: '8px 12px',
          fontSize: '14px',
          color: '#666'
        }}>
          🔍 Адреса не найдены
        </div>
      )}
    </div>
  );
}