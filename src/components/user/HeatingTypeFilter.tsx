import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleHeatingType } from '../../features/catalog/catalogSlice';
import type { RootState } from '../../app/store';
import './HeatingTypeFilter.css';

interface HeatingTypeFilterProps {
  isVisible?: boolean;
}

const HeatingTypeFilter: React.FC<HeatingTypeFilterProps> = ({ isVisible = true }) => {
  const dispatch = useDispatch();
  const selectedHeatingTypes = useSelector((s: RootState) => s.catalog.heatingTypes);
  const [expanded, setExpanded] = useState(true);

  // Доступные типы нагрева для варочных панелей
  const heatingTypes = [
    { value: 'газовые', label: 'Газовые', icon: '🔥' },
    { value: 'электрические', label: 'Электрические', icon: '⚡' },
    { value: 'индукционные', label: 'Индукционные', icon: '🧲' }
  ];

  const handleToggleHeatingType = (heatingType: string) => {
    dispatch(toggleHeatingType(heatingType));
  };

  if (!isVisible) return null;

  return (
    <div className="heating-type-filter">
      <button 
        className="heating-type-filter-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="filter-title">
          <span className="filter-icon">🔥</span>
          Тип нагрева
        </span>
        <ChevronDown 
          size={16} 
          className={`chevron ${expanded ? 'expanded' : ''}`}
        />
      </button>
      
      {expanded && (
        <div className="heating-type-filter-content">
          <div className="heating-types-list">
            {heatingTypes.map(heatingType => (
              <label key={heatingType.value} className="heating-type-checkbox">
                <input
                  type="checkbox"
                  checked={selectedHeatingTypes.includes(heatingType.value)}
                  onChange={() => handleToggleHeatingType(heatingType.value)}
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
  );
};

export default HeatingTypeFilter;
