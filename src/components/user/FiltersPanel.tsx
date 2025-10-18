import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import type { FilterState } from '../../types/product';
import './FiltersPanel.css';

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableBrands: string[];
  minPrice: number;
  maxPrice: number;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  availableBrands,
  minPrice,
  maxPrice,
  isOpen,
  onClose,
  onApply
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    price: boolean;
    brands: boolean;
  }>({
    price: true,
    brands: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandToggle = (brand: string) => {
    // Если бренд уже выбран - убираем его
    if (filters.brands.includes(brand)) {
      onFiltersChange({
        ...filters,
        brands: []
      });
    } else {
      // Иначе выбираем только этот бренд (убираем остальные)
      onFiltersChange({
        ...filters,
        brands: [brand]
      });
    }
  };

  const handlePriceRangeChange = (index: number, value: string) => {
    const newRange = [...filters.priceRange] as [number, number];
    newRange[index] = parseInt(value) || 0;
    onFiltersChange({
      ...filters,
      priceRange: newRange
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: 'all',
      priceRange: [minPrice, maxPrice],
      brands: [],
      inStock: false,
      sortBy: 'rating',
      sortDirection: 'desc'
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) count++;
    if (filters.brands.length > 0) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="filters-panel-overlay" onClick={onClose}>
      <div className="filters-panel" onClick={(e) => e.stopPropagation()}>
        <div className="filters-header">
          <div className="filters-title">
            <Filter size={20} />
            <h3>Фильтры</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="active-filters-count">{getActiveFiltersCount()}</span>
            )}
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="filters-content">
          {/* Ценовой диапазон */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('price')}
            >
              <span>Цена</span>
              <ChevronDown 
                size={16} 
                className={`chevron ${expandedSections.price ? 'expanded' : ''}`}
              />
            </button>
            {expandedSections.price && (
              <div className="filter-section-content">
                <div className="price-range">
                  <div className="price-inputs">
                    <div className="price-input">
                      <label>От</label>
                      <input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                        min={minPrice}
                        max={maxPrice}
                      />
                    </div>
                    <div className="price-input">
                      <label>До</label>
                      <input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                        min={minPrice}
                        max={maxPrice}
                      />
                    </div>
                  </div>
                  <div className="price-range-display">
                    {filters.priceRange[0].toLocaleString()} ₽ — {filters.priceRange[1].toLocaleString()} ₽
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Бренды */}
          {availableBrands.length > 0 && (
            <div className="filter-section">
              <button 
                className="filter-section-header"
                onClick={() => toggleSection('brands')}
              >
                <span>Бренды</span>
                <ChevronDown 
                  size={16} 
                  className={`chevron ${expandedSections.brands ? 'expanded' : ''}`}
                />
              </button>
              {expandedSections.brands && (
                <div className="filter-section-content">
                  <div className="brands-list">
                    {availableBrands.map(brand => (
                      <label key={brand} className="brand-checkbox">
                        <input
                          type="radio"
                          name="brand"
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                        />
                        <span className="checkmark"></span>
                        <span className="brand-name">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <div className="filters-footer">
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Очистить все
          </button>
          {onApply ? (
            <button className="apply-filters-btn" onClick={onApply}>
              Применить
            </button>
          ) : (
            <button className="apply-filters-btn" onClick={onClose}>
              Применить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;

