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
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form"
import * as z from "zod";
import { useForm, Resolver, UseFormReturn } from "react-hook-form"
import { toast } from "react-toastify"
import { revalidatePath } from "next/cache"
import { useRouter } from 'next/navigation';
import userType from "@/types/model/users"
import { useTablesStore } from "@/store/useTablesStore"
import Select from "@/components/form/Select"
import { ChevronDownIcon } from "lucide-react"
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

    const [selectedValue, setSelectedValue] = useState(0);

    const handleRadioChange = (val: any) => {        

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
            <DialogContent className="sm:max-w-[425px] ">
                {/* <Form > */}
                <form className="gap-8 flex flex-col" >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">

                        {
                            <div className="relative">
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

                        }

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
                        </div>



                    </div>

                </form>
                {/* </Form> */}
            </DialogContent>
        </Dialog>
    )
}