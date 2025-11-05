"use client"

import { TableBody as TBody, TableCell, TableRow } from "@/components/ui/table";
import { useUsersStore } from "@/store/useUsersStore";
import { useEffect, useState } from "react";
import listDataType from "@/types/listDataTable";
import { set } from "zod";

export default function TableBody({
    api,
    listData
} : {
    api: string,
    listData: listDataType[],
}) {

    const [loading, setLoading] =  useState(false);
    const moduls = useUsersStore(state => state.users);
    const searchModuls = useUsersStore(state => state.searchUsers);
    const setModuls = useUsersStore(state => state.setUsers);
    const takeModuls = useUsersStore(state => state.usersTake);
    const pageModuls = useUsersStore(state => state.usersPage);    
    const setModulsTotal = useUsersStore(state => state.setUsersTotal);
    const setDefault = useUsersStore(state => state.setDefault);


    

    useEffect(() => {

        setLoading(true);

        const fetchData = async () => {

            const params = new URLSearchParams({
                search: searchModuls,
                take: takeModuls?.toString() || '10',
                page: pageModuls?.toString() || '1' 
            });

            const res = await fetch(`${api}?${params.toString()}`, {
                method: 'GET',
                next: {
                    tags: ['users-data'],
                }
            });

            const resJson: {
                message?: string;
                data: any;
                total: number;
            } = await res.json();            
            

            setModuls(resJson.data);
            setModulsTotal(resJson.total);
        }

        fetchData().finally(() => setLoading(false));
    }, [searchModuls, takeModuls, pageModuls]);    

    loading && <div>Loading...</div>;


    return (
        <TBody className="divide-y divide-gray-100 dark:divide-white/5">
            {moduls.map((order, idx) => (
                <TableRow key={order.id ?? idx}>
                    <TableCell className="px-4 py-3 w-10 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {idx + 1 + ((pageModuls! - 1) * takeModuls!)}                        
                    </TableCell>
                    {
                        listData.map((data :any, idx2) => {
                            const Component = data.component;                            

                            return (<Component key={`${data.nama}-${idx2}`} table={order} />)
                        })
                    }
                    
                   

                    
                </TableRow>
            ))}
        </TBody>
    );
}