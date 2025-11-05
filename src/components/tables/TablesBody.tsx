"use client"

import { TableBody as TBody, TableCell, TableRow } from "@/components/ui/table";
import { useTablesStore } from "@/store/useTablesStore";
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
    const tables = useTablesStore(state => state.tables);
    const searchModuls = useTablesStore(state => state.searchTables);
    const setModuls = useTablesStore(state => state.setTables);
    const takeModuls = useTablesStore(state => state.tablesTake);
    const pageModuls = useTablesStore(state => state.tablesPage);    
    const setModulsTotal = useTablesStore(state => state.setTablesPage);
    // const setDefault = useTablesStore(state => state.setTablesDefault);


    

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
            {tables.map((order, idx) => (
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