// ЕДИНСТВЕННАЯ ответственность: читать URL (?q&chip&sort&page&fav=1) и накатывать в Redux одним экшеном.
// Любая навигация осуществляется ИСКЛЮЧИТЕЛЬНО из UI (см. useCatalogUrlActions.ts).

import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { applyQuery } from "../features/catalog/catalogSlice";

type Shape = { q: string; chip: string; sort: string; page: number; favoriteOnly: boolean };

function parseSearch(search: string): Shape {
    const p = new URLSearchParams(search);
    return {
        q: p.get("q") ?? "", // Убираем trim() чтобы сохранять пробелы
        chip: p.get("chip") ?? "Все",
        sort: p.get("sort") ?? "popular",
        page: p.get("page") ? Math.max(1, Number(p.get("page"))) : 1,
        favoriteOnly: p.get("fav") === "1",
    };
}

function eq(a: Shape, b: Shape){
    return a.q===b.q && a.chip===b.chip && a.sort===b.sort && a.page===b.page && a.favoriteOnly===b.favoriteOnly;
}

export default function LocationSync(){
    const location = useLocation();
    const dispatch = useDispatch();
    const catalog = useSelector((s:RootState)=>s.catalog);

    // Нормализованные формы
    const urlShape   = useMemo(()=>parseSearch(location.search), [location.search]);
    const stateShape = useMemo<Shape>(()=>({
        q: catalog.q ?? "", // Убираем trim() чтобы сохранять пробелы
        chip: catalog.chip ?? "Все",
        sort: catalog.sort ?? "popular",
        page: Math.max(1, catalog.page ?? 1),
        favoriteOnly: !!catalog.favoriteOnly,
    }), [catalog]);

    useEffect(()=>{
        if (location.pathname !== "/") return;
        console.log('LocationSync: URL changed', { urlShape, stateShape, equal: eq(urlShape, stateShape) });
        if (!eq(urlShape, stateShape)) {
            console.log('LocationSync: Dispatching applyQuery with:', urlShape);
            dispatch(applyQuery(urlShape)); // БЕЗ побочных сбросов
        }
    }, [location.pathname, urlShape, stateShape, dispatch]);

    return null;
}
