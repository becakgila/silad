"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modul from "@/types/model/modul"
import { FormEvent, useEffect, useState } from "react"


import {
    Table as TableUi,
    TableCell,
    TableHeader,
    TableRow,
    TableBody
} from "@/components/ui/table";
import Radio from "@/components/form/input/Radio"
import { log } from "console"

interface HakEditProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    title?: string;
    description?: string;

}


export default function HakEdit({
    IconButton,
    id,
    title = "Edit Hak Akses",
    description = "Buat perubahan di sini. Klik radio button untuk merubah Hak.",
}: Readonly<HakEditProps>) {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [option, setOption] = useState<{
        value: number | string,
            label: string,
            level: number
    }[]>([])    

    const handleRadioChange = async (val: any, idx: number) => {  
        
        const response = await fetch(`/api/userHaks`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                where: {
                    user_id: Number(id),
                    modul_id: Number(option[idx].value),
                },
                data: {
                    level: Number(val),
                }                                
            }),
        })
        
        if (!response.ok) {
            console.error('Failed to update hak level', await response.text());
            return;
        }        

        setOption((beforeVal) => beforeVal.map((item, sidx) => {     
            if (sidx === idx) {
                return { 
                    ...item, 
                    level:
                    Number(val)
                };
            } else {
                return item;
            }
        }));
    }

    async function moduleFetch() {
        
        const response = await fetch(`/api/modules?userId=${id}`, {
            method: 'GET'            
        })

        const data = (await response.json()).data;                    

        const option = data.map((modul: Modul) => ({
            value: modul.modul_id,
            label: modul.modul_name,
            level: modul.user_haks.length > 0 ? modul.user_haks[0].level : 1,
        }))            
        setOption(option);

    }

    useEffect(() => {
        moduleFetch();
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] sm:max-h-[480px] md:max-h-[720px] max-w-full max-h-full flex" >
            
                <form className="gap-8 flex flex-col h-auto w-full" >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 overflow-y-auto">
                        <TableUi>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"

                                    >
                                        {" "}
                                    </TableCell>


                                    {
                                        [1, 2, 3, 4].map((val: number) => (
                                            <TableCell
                                                key={val}
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"

                                            >
                                                level{" " + val}
                                            </TableCell>))
                                    }


                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                                {option.map((order: any, idx) => { 
                                    // console.log();
                                    
                                    return (
                                    <TableRow key={order.label ?? idx}>
                                        <TableCell className="px-4 py-3 w-10 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                            {order.label}
                                        </TableCell>
                                        {
                                            [1, 2, 3, 4].map((val: number) => (
                                                <TableCell key={val} className="px-4 py-3 text-gray-500 items-center text-center text-theme-sm dark:text-gray-400">
                                                    <Radio
                                                        id={`radio-${order.value}-${val}`}
                                                        name={`group-${order.value}`}
                                                        value={val.toString()}
                                                        checked={order.level === val}
                                                        onChange={(ref) =>{
                                                            handleRadioChange(ref, idx)
                                                        }}
                                                        className="flex justify-center "
                                                        

                                                    />
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                )})}
                            </TableBody>
                        </TableUi>

                    </div>

                </form>
             
            </DialogContent>
        </Dialog>
    )
}