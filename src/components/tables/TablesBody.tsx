"use client"
import Button from "@/components/ui/button/Button";
import { TableBody as TBody, TableCell, TableRow } from "@/components/ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import ModulsEdit from "./TablesEdit";
import ModulsSwitch from "./TablesSwitch";
import Modul from "@/types/model/modul";
import ModulsDelete from "./TablesDelete";
import { useUsersStore } from "@/store/useUsersStore";
import { useEffect } from "react";
import User from "@/types/model/users";
import listDataType from "@/types/listDataTable";

export default function TableBody({
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
        <TBody className="divide-y divide-gray-100 dark:divide-white/5">
            {moduls.map((order, idx) => (
                <TableRow key={order.id ?? idx}>
                    <TableCell className="px-4 py-3 w-10 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {idx + 1 + ((pageModuls! - 1) * takeModuls!)}                        
                    </TableCell>
                    {
                        listData.map((data :any, idx2) => {
                            const Component = data.component;                            

                            return (<Component key={data.name + idx2} table={order} />)
                        })
                    }
                    
                    {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.nips || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.phone || '-' }
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.level}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.fakultas_id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.prodi_id}
                    </TableCell>
                    <ModulsSwitch defaultChecked={order.status === 'yes'} modulId={order.id} field="status" />
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.email_verified_at ? new Date(order.email_verified_at).toLocaleDateString() : "-"  }
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(order.updated_at).toLocaleDateString()}
                    </TableCell> */}
                    {/* <ModulsSwitch defaultChecked={order.modul_aktif === 'yes'} modulId={order.modul_id} field="modul_aktif" /> */}
                    {/* <ModulsSwitch
                        defaultChecked={order.modul_newtab === 'yes'}
                        modulId={order.modul_id}
                        field="modul_newtab"
                    /> */}

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
        </TBody>
    );
}