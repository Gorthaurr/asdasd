// Чипсы категорий
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCatalogUrlActions } from '../../routing/useCatalogUrlActions';
import { selectCategories } from '../../features/catalog/selectors';
import type { RootState } from '../../app/store';


export default function Chips(){
    const { setChip } = useCatalogUrlActions(); // используем URL-действия
    const chip = useSelector((s:RootState)=>s.catalog.chip); // выбранная категория
    const cats = useSelector(selectCategories); // список категорий
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`chips animated-chips ${isVisible ? 'visible' : ''}`} id="chips" aria-label="Категории">
            {cats.map((c, index) => (
                <button 
                    key={c} 
                    className={`chip animated-chip ${c===chip ? ' is-active' : ''}`} 
                    aria-pressed={c===chip} 
                    onClick={()=>setChip(c)}
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