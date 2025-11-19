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
    api: string,
    formSchema: z.ZodSchema<any>;
    resolver: Resolver<any, any, any> | undefined;    
    formData: React.FC<{ form: UseFormReturn<any, any, any> }>[];
    title?: string;
    description?: string;
    refreshState?: (data : any)=>void;
}




export default function TablesAdd({
    IconButton,    
    api,
    formSchema,
    resolver,    
    formData,
    title = "Tambah",
    description="Buat penambahan data di sini. Klik simpan ketika sudah melakukan penambahan.",
    refreshState
}: Readonly<ModulsEditProps>) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const setTables = useTablesStore((state) => state.setTables)
    const tables = useTablesStore((state) => state.tables)
    const router = useRouter();

    useEffect(() => {        
        
        
        
    }, [])


    const form = useForm<z.infer<any>>({
        resolver: resolver,
        // defaultValues: {
            
        // },
        
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            setIsLoading(true)

            // Detect if any value is a File or FileList and build FormData when needed
            const valuesObj: Record<string, any> = values as any;
            const hasFile = Object.values(valuesObj).some(
                (v) => v instanceof File || (typeof FileList !== 'undefined' && v instanceof FileList)
            );

            let body: BodyInit;
            const headers: Record<string, string> = {};

            if (hasFile) {
                const formData = new FormData();
                Object.entries(valuesObj).forEach(([k, v]) => {
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
                });
                body = formData;
                // when sending FormData, browser sets Content-Type including boundary
            } else {
                body = JSON.stringify(valuesObj);
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${api}`, {
                method: 'POST',
                body,
                headers: Object.keys(headers).length ? headers : undefined,
            })

            if (response.status === 200) {
                const res = await response.json();
                toast.success("berhasil menambah.")
                if(refreshState){
                    refreshState(res.data)
                }else{

                    setTables([...tables, res.data]);
                }
                form.reset();
            } else if (response.status === 400) {
                const res = await response.json();
                toast.warning(`Gagal menambah. ${res.message || 'Terjadi kesalahan tidak terduga.'}`)
            } else {
                // other non-OK statuses
                const text = await response.text().catch(() => '');
                toast.warning(`Gagal menambah. (${response.status}) ${text}`)
            }

        } catch (error) {
            // Handle error if necessary
            console.error(error)
        } finally {
            
            setIsOpen(false);
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
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
                                <Button variant="outline">Batal</Button>
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