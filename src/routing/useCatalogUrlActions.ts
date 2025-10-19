// Хук для UI: меняет URL (сохраняя прочие параметры), НИКАКИХ диспатчей отсюда.
// LocationSync сам подхватит URL и положит значения в Redux.

import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function withParams(
    curr: URLSearchParams,
    patch: (p: URLSearchParams)=>void
){
    const p = new URLSearchParams(curr.toString()); // копия
    patch(p);
    // Убираем дефолты (чистый канон)
    if (p.get("chip")==="Все") p.delete("chip");
    if (p.get("sort")==="popular") p.delete("sort");
    if (p.get("page")==="1") p.delete("page");
    if (p.get("fav")==="0") p.delete("fav");
    const s = p.toString();
    return s ? `?${s}` : "";
}

export function useCatalogUrlActions(){
    const location = useLocation();
    const navigate = useNavigate();

    const setQ = useCallback((q:string)=>{
        console.log('setQ called with:', q);
        if (location.pathname !== "/") {
            const url = `/?q=${encodeURIComponent(q)}`;
            console.log('setQ: navigating to:', url);
            navigate(url, { replace: false });
            return;
        }
        const next = withParams(new URLSearchParams(location.search), p=>{
            // Убираем trim() чтобы сохранять пробелы
            if (q) p.set("q", q); else p.delete("q");
            p.delete("page"); // поиск всегда на 1-й странице
            // Сбрасываем фильтры при поиске
            p.delete("brands");
            p.delete("heating_types");
            p.delete("price_min");
            p.delete("price_max");
            p.delete("in_stock");
        });
        console.log('setQ: navigating to:', { pathname: "/", search: next });
        // replace для набора текста — не захламляем историю
        navigate({ pathname: "/", search: next }, { replace: true });
    }, [location, navigate]);

    const setChip = useCallback((chip:string)=>{
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const next = withParams(base, p=>{
            if (chip && chip!=="Все") p.set("chip", chip); else p.delete("chip");
            p.delete("page"); // смена фильтра -> страница 1
            // Сбрасываем все фильтры при смене категории
            p.delete("brands");
            p.delete("heating_types");
            p.delete("price_min");
            p.delete("price_max");
            p.delete("in_stock");
            p.delete("sort");
        });
        navigate("/" + next, { replace: false });
        // Скролл к началу страницы при смене фильтра
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location, navigate]);

    const setSort = useCallback((sort:string)=>{
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const next = withParams(base, p=>{
            if (sort && sort!=="popular") p.set("sort", sort); else p.delete("sort");
            p.delete("page"); // смена сортировки -> страница 1
        });
        navigate("/" + next, { replace: false });
        // Скролл к началу страницы при смене сортировки
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location, navigate]);

    const setPage = useCallback((page:number)=>{
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const next = withParams(base, p=>{
            const n = Math.max(1, page|0);
            if (n>1) p.set("page", String(n)); else p.delete("page");
        });
        navigate("/" + next, { replace: false });
    }, [location, navigate]);

    const toggleFavorites = useCallback(()=>{
        // Всегда ведём на "/" с правильным fav, сохраняя q/chip/sort и сбрасывая page
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const isFav = base.get("fav")==="1";
        console.log('toggleFavorites: current isFav:', isFav);
        console.log('toggleFavorites: current URL:', location.pathname + location.search);
        
        const next = withParams(base, p=>{
            if (isFav) p.delete("fav"); else p.set("fav","1");
            p.delete("page");
        });
        
        const newUrl = "/" + next;
        console.log('toggleFavorites: navigating to:', newUrl);
        
        navigate("/" + next, { replace: false });
        // Скролл к началу страницы при переключении избранного
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location, navigate]);

    const setBrands = useCallback((brands: string[])=>{
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const next = withParams(base, p=>{
            if (brands.length > 0) {
                p.set("brands", brands.join(','));
            } else {
                p.delete("brands");
            }
            p.delete("page"); // смена фильтра -> страница 1
        });
        navigate("/" + next, { replace: false });
    }, [location, navigate]);

    const setHeatingTypes = useCallback((heatingTypes: string[])=>{
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const next = withParams(base, p=>{
            if (heatingTypes.length > 0) {
                p.set("heating_types", heatingTypes.join(','));
            } else {
                p.delete("heating_types");
            }
            p.delete("page"); // смена фильтра -> страница 1
        });
        navigate("/" + next, { replace: false });
    }, [location, navigate]);

    const setPriceRange = useCallback((priceRange: [number, number])=>{
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const next = withParams(base, p=>{
            const [min, max] = priceRange;
            if (min > 0) p.set("price_min", String(min)); else p.delete("price_min");
            if (max < 1000000) p.set("price_max", String(max)); else p.delete("price_max");
            p.delete("page"); // смена фильтра -> страница 1
        });
        navigate("/" + next, { replace: false });
    }, [location, navigate]);

    const setInStock = useCallback((inStock: boolean)=>{
        const base = location.pathname === "/" ? new URLSearchParams(location.search) : new URLSearchParams("");
        const next = withParams(base, p=>{
            if (inStock) p.set("in_stock", "true"); else p.delete("in_stock");
            p.delete("page"); // смена фильтра -> страница 1
        });
        navigate("/" + next, { replace: false });
    }, [location, navigate]);

    return { setQ, setChip, setSort, setPage, toggleFavorites, setBrands, setHeatingTypes, setPriceRange, setInStock };
}
