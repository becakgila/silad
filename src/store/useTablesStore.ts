import { create } from "zustand";

interface tableState<T = any> {
    tables: T[];
    setTables: (tables: T[]) => void;
    searchTables: string;
    setSearchTablesUpdate: (search: string) => void;
    tablesTake: number;
    setTablesTake: (take: number) => void;
    tablesPage: number;
    setTablesPage: (page: number) => void;
    tablesTotal: number;
    setTablesTotal: (total: number) => void;
    setTablesDefault: () => void;
    lastPath: string;
    setLastPath: (path: string) => void;
    setTableFromId: (id: string | number, idTable: string | number, table: T) => void;
}


export const useTablesStore = create<tableState<any>>((set) => ({
    tables: [],
    setTables: (tables: any[]) => set({ tables }),
    searchTables: '',
    setSearchTablesUpdate: (search: string) => set({ searchTables: search, tablesPage: 1 }),
    tablesTake: 10,
    setTablesTake: (take: number) => set({ tablesTake: take }),
    tablesPage: 1,
    setTablesPage: (page: number) => set({ tablesPage: page }),
    tablesTotal: 0,
    setTablesTotal: (total: number) => set({ tablesTotal: total }),
    lastPath: '',
    setLastPath: (path: string) => {
        const currentState = useTablesStore.getState();
        const pathChanged = currentState.lastPath !== path;
        set({
            lastPath: path,
            ...(pathChanged && {
                tablesPage: 1, 
                searchTables: ''
            })
        });
    },
    setTablesDefault: () => set({
        tables: [],
        searchTables: '',
        tablesTake: 10,
        tablesPage: 1,
        tablesTotal: 0,
        lastPath: '',
    }),
    setTableFromId: (id: string | number, idTable="id", tableUpdate) => set((state) => ({
        tables: state.tables.map(table => table[idTable] === id ? { ...table ,...tableUpdate } : table)
    }))

})); 