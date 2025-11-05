import { create } from "zustand";

import User from "@/types/model/users";

interface UsersState {
    users: any[];
    setUsers: (users: User[]) => void;
    searchUsers: string;
    setSearchUsersUpdate: (search: string) => void;
    usersTake: number;
    setUsersTake: (take: number) => void;
    usersPage: number;
    setUsersPage: (page: number) => void;
    UsersTotal: number;
    setUsersTotal: (total: number) => void;
    setDefault: () => void;
}


export const useUsersStore = create<UsersState>((set) => ({
    users: [],
    setUsers: (users: any[]) => set({ users }),
    searchUsers: '',
    setSearchUsersUpdate: (search: string) => set({ searchUsers: search, usersPage: 1 }),
    usersTake: 10,
    setUsersTake: (take: number) => set({ usersTake: take }),
    usersPage: 1,
    setUsersPage: (page: number) => set({ usersPage: page }),
    UsersTotal: 0,
    setUsersTotal: (total: number) => set({ UsersTotal: total }),
    setDefault: () => set({
        users: [],
        searchUsers: '',
        usersTake: 10,
        usersPage: 1,
        UsersTotal: 0,
    }),
}));