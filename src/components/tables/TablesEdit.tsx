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
}




export default function TablesEdit({
    IconButton,
    data,
    api,
    formSchema,
    resolver,
    id,
    formData,
    title = "Edit",
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

            console.log(values, 'ini val');
            

            const response = await fetch(`${api}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(values),
            })

            if (response.status === 200) {
                toast.success("Modul berhasil diupdate.")
                const updatedData = await response.json();
                
                setTableFromId(id, "tahun_ajaran_id", updatedData.data);
            }



            console.log(response);

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
                                <Button disabled={isLoading} variant="outline">Batal</Button>
                            </DialogClose>
                            {/* <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Simpan Perubahan"}</Button> */}
                            <Button type="submit" >Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}