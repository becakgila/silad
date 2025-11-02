import { create } from "zustand";
import Modul  from "@/types/model/modul";

interface ModulsState {
    moduls: Modul[];
    setModuls: (moduls: Modul[]) => void;
    searchModuls: string;
    setSearchModulsUpdate: (search: string) => void;
    modulsTake: number;
    setModulsTake: (take: number) => void;
    modulsPage: number;
    setModulsPage: (page: number) => void;
    modulsTotal: number;
    setModulsTotal: (total: number) => void;
}


export const useModuls = create<ModulsState>((set) => ({
    moduls: [],
    setModuls: (moduls: Modul[]) => set({ moduls }),
    searchModuls: '',
    setSearchModulsUpdate: (search: string) => set({ searchModuls: search, modulsPage: 1 }),
    modulsTake: 10,
    setModulsTake: (take: number) => set({ modulsTake: take }),
    modulsPage: 1,
    setModulsPage: (page: number) => set({ modulsPage: page }),
    modulsTotal: 0,
    setModulsTotal: (total: number) => set({ modulsTotal: total }),
}));