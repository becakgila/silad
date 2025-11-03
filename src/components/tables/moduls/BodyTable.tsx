"use client"
import Button from "@/components/ui/button/Button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import ModulsEdit from "./ModulsEdit";
import ModulsSwitch from "./ModulsSwitch";
import Modul from "@/types/model/modul";
import ModulsDelete from "./ModulsDelete";
import { useModuls } from "@/hooks/useModuls";
import { useEffect } from "react";

export default function BodyTable() {


    const moduls = useModuls(state => state.moduls);
    const searchModuls = useModuls(state => state.searchModuls);
    const setModuls = useModuls(state => state.setModuls);
    const takeModuls = useModuls(state => state.modulsTake);
    const pageModuls = useModuls(state => state.modulsPage);
    const setModulsTotal = useModuls(state => state.setModulsTotal);

    useEffect(() => {

        const fetchData = async () => {

            const params = new URLSearchParams({
                search: searchModuls,
                take: takeModuls?.toString() || '10',
                page: pageModuls?.toString() || '1' 
            });

            const res = await fetch(`/api/component/modules?${params.toString()}`, {
                method: 'GET',
                next: {
                    tags: ['moduls-data'],
                }
            });

            const resJson: {
                message?: string;
                data: Modul[];
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
                <TableRow key={order.modul_id ?? idx}>
                    <TableCell className="px-4 py-3 w-10 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {idx + 1 + ((pageModuls! - 1) * takeModuls!)}                        
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.modul_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.modul_url}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.modul_simbol}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.modul_akses}
                    </TableCell>
                    <ModulsSwitch defaultChecked={order.modul_aktif === 'yes'} modulId={order.modul_id} field="modul_aktif" />
                    <ModulsSwitch
                        defaultChecked={order.modul_newtab === 'yes'}
                        modulId={order.modul_id}
                        field="modul_newtab"
                    />

                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
                        <ModulsEdit IconButton={(<Button size="sm" variant="primary"
                            className="bg-green-600"
                        >
                            <PencilIcon />
                        </Button>)} data={order} />

                        <ModulsDelete OpenButton={
                            (<Button size="sm" variant="primary"
                                className="bg-red-500"
                            >
                                <TrashBinIcon />
                            </Button>)
                        }
                            modulId={order.modul_id.toString()}
                        />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}