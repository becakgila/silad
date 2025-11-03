"use client"

import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useUsersStore } from "@/store/useUsersStore";
import { useEffect } from "react";
import listDataType from "@/types/listDataTable";

export default function UsersBody({
    api,
    listData
} : {
    api: string,
    listData: listDataType[],
}) {


    const moduls = useUsersStore(state => state.users);
    const searchModuls = useUsersStore(state => state.searchUsers);
    const setModuls = useUsersStore(state => state.setUsers);
    const takeModuls = useUsersStore(state => state.usersTake);
    const pageModuls = useUsersStore(state => state.usersPage);
    const setModulsTotal = useUsersStore(state => state.setUsersTotal);

    useEffect(() => {

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

            console.log(resJson, 'fetch data');
            

            setModuls(resJson.data);
            setModulsTotal(resJson.total);
        }

        fetchData();
    }, [searchModuls, takeModuls, pageModuls]);    


    return (
        <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
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
                    
                   

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
                        {/* <ModulsEdit IconButton={(<Button size="sm" variant="primary"
                            className="bg-green-600"
                        >
                            <PencilIcon />
                        </Button>)} data={order} /> */}
                        <></>

                        {/* <ModulsDelete OpenButton={
                            (<Button size="sm" variant="primary"
                                className="bg-red-500"
                            >
                                <TrashBinIcon />
                            </Button>)
                        }
                            modulId={order.modul_id.toString()}
                        /> */}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}