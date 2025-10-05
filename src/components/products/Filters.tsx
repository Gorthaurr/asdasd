import { useState } from 'react';

export default function Filters() {
  const [priceRange, setPriceRange] = useState([4500, 300500]);
  const [selectedMemory, setSelectedMemory] = useState<string[]>([]);
  const [selectedRAM, setSelectedRAM] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCores, setSelectedCores] = useState<string[]>([]);

  const memoryOptions = ['512 ГБ', '128 ГБ', '256 ГБ', '64 ГБ', '32 ГБ'];
  const ramOptions = ['1 ГБ', '1.5 ГБ', '2 ГБ'];
  const brandOptions = ['Apple', 'Honor', 'Samsung'];
  const coreOptions = ['4', '6', '8'];

  const toggleFilter = (value: string, selected: string[], setter: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  return (
    <aside className="filters-sidebar">
      <div className="filter-group">
        <h3 className="filter-title">Цена, ₽</h3>
        <div className="price-inputs">
          <input 
            type="text" 
            value={`от ${priceRange[0].toLocaleString('ru-RU')}`} 
            readOnly 
          />
          <input 
            type="text" 
            value={`до ${priceRange[1].toLocaleString('ru-RU')}`} 
            readOnly 
          />
        </div>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Встроенная память</h3>
        {memoryOptions.map(option => (
          <label key={option} className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={selectedMemory.includes(option)}
              onChange={() => toggleFilter(option, selectedMemory, setSelectedMemory)}
            />
            <span>{option}</span>
          </label>
        ))}
        <button className="filter-more">Ещё</button>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Оперативная память</h3>
        {ramOptions.map(option => (
          <label key={option} className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={selectedRAM.includes(option)}
              onChange={() => toggleFilter(option, selectedRAM, setSelectedRAM)}
            />
            <span>{option}</span>
          </label>
        ))}
        <button className="filter-more">Ещё</button>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Бренд</h3>
        {brandOptions.map(option => (
          <label key={option} className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={selectedBrands.includes(option)}
              onChange={() => toggleFilter(option, selectedBrands, setSelectedBrands)}
            />
            <span>{option}</span>
          </label>
        ))}
        <button className="filter-more">Ещё</button>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Количество ядер</h3>
        {coreOptions.map(option => (
          <label key={option} className="filter-checkbox">
            <input 
              type="checkbox" 
              checked={selectedCores.includes(option)}
              onChange={() => toggleFilter(option, selectedCores, setSelectedCores)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <button className="filter-reset">Показать все фильтры</button>
    </aside>
  );
}
