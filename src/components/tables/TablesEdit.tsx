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

interface ModulsEditProps<T = any> {
    IconButton: React.JSX.Element,
    data: T,
    api: string,
    formSchema: z.ZodSchema<any>;
    resolver: Resolver<any, any, any> | undefined;
    id: string | number;
    formData: React.FC<{ form: UseFormReturn<any, any, any> }>[];
    title?: string;
    description?: string;
    idLabel?: string;
    refreshState?: (data:any)=>void;
}

export default function TablesEdit({
    IconButton,
    data,
    api,
    formSchema,
    resolver,
    id,
    idLabel="id",
    formData,
    title = "Edit",
    refreshState,
    description="Buat perubahan di sini. Klik simpan ketika sudah melakukan perubahan."
}: Readonly<ModulsEditProps>) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const router = useRouter();

    const setTableFromId = useTablesStore(state => state.setTableFromId);


    const form = useForm<z.infer<any>>({
        resolver: resolver,
        defaultValues: { ...JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\"")) },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {   
            setIsLoading(true)                        

            // Detect files in values and use FormData when present
            const valuesObj: Record<string, any> = values as any;
            const hasFile = Object.values(valuesObj).some(
                (v) => v instanceof File || (typeof FileList !== 'undefined' && v instanceof FileList)
            );

            let body: BodyInit;
            const headers: Record<string, string> = {};

            if (hasFile) {
                const formData = new FormData();
                for (const [k, v] of Object.entries(valuesObj)) {
                    if (v instanceof File) {
                        formData.append(k, v);
                    } else if (typeof FileList !== 'undefined' && v instanceof FileList) {
                        if (v.length > 0) formData.append(k, v[0]);
                    } else if (v === undefined || v === null) {
                        formData.append(k, "");
                    } else if (typeof v === 'object') {
                        formData.append(k, JSON.stringify(v));
                    } else {
                        formData.append(k, String(v));
                    }
                }
                body = formData;
            } else {
                body = JSON.stringify(valuesObj);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${api}/${id}`, {
                method: 'PATCH',
                body,
                headers: Object.keys(headers).length ? headers : undefined,
            })

            if (response.status === 200) {
                toast.success("data berhasil diupdate.")
                const updatedData = await response.json();

                if(refreshState){

                    refreshState(updatedData.data)

                }else{

                    setTableFromId(id, idLabel, updatedData.data);
                }
                
            }



            

        } catch (error) {
            // Handle error if necessary
            console.error(error)
        } finally {
            router.refresh()
            setIsOpen(false);
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] sm:max-h-[720px] overflow-auto ">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-8 flex flex-col" >
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">

                            {
                                formData.map((Component, idx) => {


                                    return (
                                        <Component
                                            key={`form-data-${idx}`}
                                            form={form}
                                        />
                                    )

                                })

                            }



                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button disabled={isLoading} variant="outline">Batal</Button>
                            </DialogClose>
                            {/* <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Simpan Perubahan"}</Button> */}
                            <Button type="submit" disabled={isLoading} >Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}