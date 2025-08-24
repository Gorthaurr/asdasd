import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CatalogState {
    q: string;
    chip: string;
    sort: string;     // "popular" | "priceAsc" | "priceDesc" | "new"
    page: number;
    pageSize: number;
    favoriteOnly: boolean;
    drawerOpen: boolean;
}

const initialState: CatalogState = {
    q: "",
    chip: "Все",
    sort: "popular",
    page: 1,
    pageSize: 8,
    favoriteOnly: false,
    drawerOpen: false,
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
        setPageSize: (s, a: PayloadAction<number>) => { s.pageSize = Math.max(1, a.payload); s.page = 1; },
        toggleFavoriteOnly: (s) => { s.favoriteOnly = !s.favoriteOnly; s.page = 1; },
        setFavoriteOnly: (s, a: PayloadAction<boolean>) => { s.favoriteOnly = !!a.payload; s.page = 1; },

        openDrawer: (s) => { s.drawerOpen = true; },
        closeDrawer: (s) => { s.drawerOpen = false; },

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
    },
});

export const {
    setQ, setChip, setSort, setPage, setPageSize,
    toggleFavoriteOnly, setFavoriteOnly,
    openDrawer, closeDrawer,
    applyQuery,
} = catalogSlice.actions;

export default catalogSlice.reducer;
