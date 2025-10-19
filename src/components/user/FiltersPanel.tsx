import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import type { FilterState } from '../../types/product';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';
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
  showHeatingTypeFilter?: boolean;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
  availableBrands,
  minPrice,
  maxPrice,
  isOpen,
  onClose,
  onApply,
  showHeatingTypeFilter = false
}) => {
  const { setBrands, setHeatingTypes, setPriceRange, setInStock } = useCatalogUrlActions();
  
  const [expandedSections, setExpandedSections] = useState<{
    price: boolean;
    brands: boolean;
    heatingTypes: boolean;
  }>({
    price: true,
    brands: true,
    heatingTypes: true,
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
      const newBrands: string[] = [];
      onFiltersChange({
        ...filters,
        brands: newBrands
      });
      setBrands(newBrands);
    } else {
      // Иначе выбираем только этот бренд (убираем остальные)
      const newBrands = [brand];
      onFiltersChange({
        ...filters,
        brands: newBrands
      });
      setBrands(newBrands);
    }
  };

  const handleHeatingTypeToggle = (heatingType: string) => {
    const currentTypes = filters.heatingTypes || [];
    if (currentTypes.includes(heatingType)) {
      // Убираем тип нагрева
      const newTypes = currentTypes.filter(type => type !== heatingType);
      onFiltersChange({
        ...filters,
        heatingTypes: newTypes
      });
      setHeatingTypes(newTypes);
    } else {
      // Добавляем тип нагрева
      const newTypes = [...currentTypes, heatingType];
      onFiltersChange({
        ...filters,
        heatingTypes: newTypes
      });
      setHeatingTypes(newTypes);
    }
  };

  const handlePriceRangeChange = (index: number, value: string) => {
    const newRange = [...filters.priceRange] as [number, number];
    newRange[index] = parseInt(value) || 0;
    onFiltersChange({
      ...filters,
      priceRange: newRange
    });
    setPriceRange(newRange);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: 'all',
      priceRange: [minPrice, maxPrice],
      brands: [],
      heatingTypes: [],
      inStock: false,
      sortBy: 'rating',
      sortDirection: 'desc'
    };
    onFiltersChange(clearedFilters);
    setBrands([]);
    setHeatingTypes([]);
    setPriceRange([minPrice, maxPrice]);
    setInStock(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) count++;
    if (filters.brands.length > 0) count++;
    if (filters.heatingTypes && filters.heatingTypes.length > 0) count++;
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

          {/* Типы нагрева для варочных панелей */}
          {showHeatingTypeFilter && (
            <div className="filter-section">
              <button 
                className="filter-section-header"
                onClick={() => toggleSection('heatingTypes')}
              >
                <span>🔥 Тип нагрева</span>
                <ChevronDown 
                  size={16} 
                  className={`chevron ${expandedSections.heatingTypes ? 'expanded' : ''}`}
                />
              </button>
              {expandedSections.heatingTypes && (
                <div className="filter-section-content">
                  <div className="heating-types-list">
                    {[
                      { value: 'газовые', label: 'Газовые', icon: '🔥' },
                      { value: 'электрические', label: 'Электрические', icon: '⚡' },
                      { value: 'индукционные', label: 'Индукционные', icon: '🧲' }
                    ].map(heatingType => (
                      <label key={heatingType.value} className="heating-type-checkbox">
                        <input
                          type="checkbox"
                          checked={(filters.heatingTypes || []).includes(heatingType.value)}
                          onChange={() => handleHeatingTypeToggle(heatingType.value)}
                        />
                        <span className="checkmark"></span>
                        <span className="heating-type-icon">{heatingType.icon}</span>
                        <span className="heating-type-name">{heatingType.label}</span>
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

