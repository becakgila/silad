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
    description = "Buat perubahan di sini. Klik radio button untuk merubah Hak."
}: Readonly<HakEditProps>) {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [option, setOption] = useState([])

    const [selectedValue, setSelectedValue] = useState("");

    const handleRadioChange = (val: any) => {

        console.log(val);
        

        setSelectedValue(val)
    }

    const handleOptionsChange = async (val: any) => {
        const response = await fetch(`/api/hak?user_id=${id}&modul_id=${val}`, {
            method: 'GET',
        })

        const data = (await response.json()).data;

        setSelectedValue(data?.level || 1)
    }

    async function moduleFetch() {



        const response = await fetch(`/api/modules`, {
            method: 'GET',
            cache: 'force-cache'
        })

        const data = (await response.json()).data;

        const option = data.map((modul: Modul) => ({
            value: modul.modul_id,
            label: modul.modul_name
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
            <DialogContent className="sm:max-w-[720px]" >
                {/* <Form > */}
                <form className="gap-8 flex flex-col" >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 overflow-scroll">
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
                                {option.map((order: any, idx) => (
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
                                                        checked={selectedValue === val.toString()}
                                                        onChange={handleRadioChange}
                                                        className="flex justify-center "
                                                        

                                                    />
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableUi>



                        {/* <div className="relative">
                            <Select
                                options={option}
                                onChange={handleOptionsChange}
                                // onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                            </span>
                        </div>



                        <div className="flex flex-col mt-6 gap-8">
                            <Radio
                                id="radio1"
                                name="group1"
                                value="1"
                                checked={selectedValue === 1}
                                onChange={handleRadioChange}
                                label="level 1"
                                disabled={selectedValue === 0}
                            />
                            <Radio
                                id="radio2"
                                name="group1"
                                value="2"
                                checked={selectedValue === 2}
                                onChange={handleRadioChange}
                                label="level 2"
                                disabled={selectedValue === 0}
                            />
                            <Radio
                                id="radio3"
                                name="group1"
                                value="3"
                                checked={selectedValue === 3}
                                onChange={handleRadioChange}
                                label="level 3"
                                disabled={selectedValue === 0}
                            />
                            <Radio
                                id="radio4"
                                name="group1"
                                value="4"
                                checked={selectedValue === 4}
                                onChange={handleRadioChange}
                                label="level 4"
                                disabled={selectedValue === 0}
                            />
                        </div> */}



                    </div>

                </form>
                {/* </Form> */}
            </DialogContent>
        </Dialog>
    )
}