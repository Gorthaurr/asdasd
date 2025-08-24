// Чипсы категорий
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChip } from '../../features/catalog/catalogSlice';
import { selectCategories } from '../../features/catalog/selectors';
import type { RootState } from '../../app/store';


export default function Chips(){
    const dispatch = useDispatch(); // диспетчер
    const chip = useSelector((s:RootState)=>s.catalog.chip); // выбранная категория
    const cats = useSelector(selectCategories); // список категорий
    return (
        <div className="chips" id="chips" aria-label="Категории">
            {cats.map(c => (
                <button key={c} className={'chip' + (c===chip ? ' is-active' : '')} aria-pressed={c===chip} onClick={()=>dispatch(setChip(c))}>{c}</button>
            ))}
        </div>
    );
}