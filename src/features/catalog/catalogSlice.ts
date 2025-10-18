import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FilterState } from "../../types/product";

export interface CatalogState {
    q: string;
    chip: string;
    sort: string;     // "popular" | "priceAsc" | "priceDesc" | "new"
    page: number;
    pageSize: number;
    favoriteOnly: boolean;
    drawerOpen: boolean;
    // Дополнительные фильтры для нового UI
    priceRange: [number, number];
    brands: string[];
    inStock: boolean;
    sortDirection: 'asc' | 'desc';
}

const initialState: CatalogState = {
    q: "",
    chip: "Все",
    sort: "popular",
    page: 1,
    pageSize: 20,
    favoriteOnly: false,
    drawerOpen: false,
    priceRange: [0, 1000000],
    brands: [],
    inStock: false,
    sortDirection: 'desc',
};

const catalogSlice = createSlice({
    name: "catalog",
    initialState,
    reducers: {
        // UI-экшены (оставляем для совместимости, если где-то используются):
        setQ: (s, a: PayloadAction<string>) => { s.q = a.payload; s.page = 1; },
        setChip: (s, a: PayloadAction<string>) => { s.chip = a.payload; s.page = 1; },
        setSort: (s, a: PayloadAction<string>) => { s.sort = a.payload; s.page = 1; },
        setPage: (s, a: PayloadAction<number>) => { s.page = Math.max(1, a.payload); },
        setPageSize: (s, a: PayloadAction<number>) => { s.pageSize = Math.max(1, Math.min(100, a.payload)); s.page = 1; },
        toggleFavoriteOnly: (s) => { s.favoriteOnly = !s.favoriteOnly; s.page = 1; },
        setFavoriteOnly: (s, a: PayloadAction<boolean>) => { s.favoriteOnly = !!a.payload; s.page = 1; },

        openDrawer: (s) => { s.drawerOpen = true; },
        closeDrawer: (s) => { s.drawerOpen = false; },
        setDrawerOpen: (s, a: PayloadAction<boolean>) => { s.drawerOpen = a.payload; },

        // ВАЖНО: один атомарный экшен для накатки URL -> Redux БЕЗ скрытых сбросов
        applyQuery: (s, a: PayloadAction<{
            q?: string; chip?: string; sort?: string; page?: number; favoriteOnly?: boolean;
        }>) => {
            const p = a.payload;
            if (p.q !== undefined) s.q = p.q;
            if (p.chip !== undefined) s.chip = p.chip;
            if (p.sort !== undefined) s.sort = p.sort;
            if (p.favoriteOnly !== undefined) s.favoriteOnly = !!p.favoriteOnly;
            if (p.page !== undefined) s.page = Math.max(1, p.page);
        },

        // Новые экшены для фильтров
        setPriceRange: (s, a: PayloadAction<[number, number]>) => {
            s.priceRange = a.payload;
            s.page = 1;
        },
        setBrands: (s, a: PayloadAction<string[]>) => {
            s.brands = a.payload;
            s.page = 1;
        },
        toggleBrand: (s, a: PayloadAction<string>) => {
            const brand = a.payload;
            if (s.brands.includes(brand)) {
                s.brands = s.brands.filter(b => b !== brand);
            } else {
                s.brands.push(brand);
            }
            s.page = 1;
        },
        setInStock: (s, a: PayloadAction<boolean>) => {
            s.inStock = a.payload;
            s.page = 1;
        },
        setSortDirection: (s, a: PayloadAction<'asc' | 'desc'>) => {
            s.sortDirection = a.payload;
        },
        applyFilters: (s, a: PayloadAction<FilterState>) => {
            const f = a.payload;
            s.chip = f.category;
            s.priceRange = f.priceRange;
            s.brands = f.brands;
            s.inStock = f.inStock;
            s.sort = f.sortBy;
            s.sortDirection = f.sortDirection;
            s.page = 1;
        },
        clearFilters: (s) => {
            s.priceRange = [0, 1000000];
            s.brands = [];
            s.inStock = false;
            s.chip = "Все";
            s.page = 1;
        },
    },
});

export const {
    setQ, setChip, setSort, setPage, setPageSize,
    toggleFavoriteOnly, setFavoriteOnly,
    openDrawer, closeDrawer, setDrawerOpen,
    applyQuery,
    setPriceRange, setBrands, toggleBrand, setInStock, setSortDirection,
    applyFilters, clearFilters,
} = catalogSlice.actions;

export default catalogSlice.reducer;
