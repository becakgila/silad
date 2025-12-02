import {create} from "zustand"

interface layananState{
    progress: string;
    setProgress: (progress: string) => void;
}

export const useLayananStore = create<layananState>((set) => ({
    progress: '',
    setProgress: (progress) => set({ progress })
}))