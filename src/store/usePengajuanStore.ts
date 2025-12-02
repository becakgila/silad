import {create} from "zustand"

interface pengajuanState{
    refresh: boolean;
    layananRefresh: () => void;
}

const usePengajuanStore = create<pengajuanState>((set) => ({
    refresh: false,
    layananRefresh: () => set((state) => ({
        refresh: !state.refresh,
    }))
}))


export default usePengajuanStore;