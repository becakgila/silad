import Button from "@/components/ui/button/Button";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";

export default async function ModulsBody() {


    const res = await fetch(`${process.env.NEXT_AUTH_URL}/api/component/modules`);

    const resJson: {
        message?: string;
        data: Array<{
            modul_id: string;
            modul_name: string;
            modul_induk: number;
            modul_urut: string;
            modul_url: string;
            modul_aktif: string;
            modul_simbol: string;
            modul_akses: string;
            modul_newtab: string;
            modul_id_sms: string;
            created_at: string,
            updated_at: string
            // add other fields as necessary
        }>;
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
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.modul_aktif}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {order.modul_newtab}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
                        <Button size="sm" variant="primary"
                        className="bg-green-600"
                        >
                            <PencilIcon />
                        </Button>
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