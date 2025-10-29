
import Button from "@/components/ui/button/Button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import ModulsEdit from "./ModulsEdit";
import ModulsSwitch from "./ModulsSwitch";
import Modul from "@/type/model/modul";
import Switch from "@/components/form/switch/Switch";

export default async function ModulsBody() {


    const res = await fetch(`${process.env.NEXT_AUTH_URL}/api/component/modules`);

    const resJson: {
        message?: string;
        data: Modul[];
    } = await res.json();

    return (
        <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {resJson.data.map((order, idx) => (
                <TableRow key={order.modul_id ?? idx}>
                    <TableCell className="px-4 py-3 w-10 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        {idx + 1}
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
                        </Button>)} data={order as any} />

                        <Button size="sm" variant="primary"
                            className="bg-red-500"

                        >
                            <TrashBinIcon />
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}