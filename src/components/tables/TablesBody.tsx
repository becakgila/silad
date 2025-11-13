"use client"

import { TableBody as TBody, TableCell, TableRow } from "@/components/ui/table";
import { useTablesStore } from "@/store/useTablesStore";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import listDataType from "@/types/listDataTable";
import { ca } from "zod/v4/locales";

export default function TableBody({
    api,
    listData
} : {
    api: string,
    listData: listDataType[],
}) {

    const [loading, setLoading] =  useState(true);
    const tables = useTablesStore(state => state.tables);
    const searchModuls = useTablesStore(state => state.searchTables);
    const setModuls = useTablesStore(state => state.setTables);
    const takeModuls = useTablesStore(state => state.tablesTake);
    const pageModuls = useTablesStore(state => state.tablesPage);    
    const setModulsTotal = useTablesStore(state => state.setTablesTotal);
    const setLastPath = useTablesStore(state => state.setLastPath);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            // Ensure the store knows about the current pathname and reset page if needed

            try{
                setLastPath(pathname);
    
                // Read the current page from the store after potential reset
                const currentState = useTablesStore.getState();
                const currentPage = currentState.tablesPage ?? 1;
    
                const params = new URLSearchParams({
                    search: searchModuls,
                    take: (takeModuls?.toString() || '10'),
                    page: currentPage.toString()
                });
    
                const res = await fetch(`${api}?${params.toString()}`, {
                    method: 'GET',
                });
    
                const resJson: {
                    message?: string;
                    data: any;
                    total: number;
                } = await res.json();
    
    
                setModuls(resJson.data);
                setModulsTotal(resJson.total);
            }catch(e){
                setModuls([]);
                setModulsTotal(0);

                console.log(e);
            }
        }

        fetchData().finally(() => setLoading(false));
    }, [searchModuls, takeModuls, pageModuls, pathname]);

    ;

    return  (
        <TBody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (<></>) : tables.map((order, idx) => (
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