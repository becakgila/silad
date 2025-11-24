"use client"
// import { Button } from "@/components/ui/button"
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
import { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import Button from "@/components/ui/button/Button";


import {
    Table as TableUi,
    TableCell,
    TableHeader,
    TableRow,
    TableBody
} from "@/components/ui/table";
import Radio from "@/components/form/input/Radio"
import { log } from "console"
import dokumenType from "@/types/model/dokumen"
import { CheckCheck, Eye, Paperclip } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "react-toastify"
import TableFormField from "../TableFormField"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface PengajuanUploadProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    title?: string;
    description?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["application/pdf",];

const pengajuanFileFormSchema = z.object({
    layananFile: z.custom<File>()
        .refine((file) => file, `File is require`)
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
        .refine((file) => ACCEPTED_TYPES.includes(file?.type), "Only .pdf formats are supported.")
})


export default function PengajuanUpload({
    IconButton,
    id,
    title = "Upload Pengajuan File",
    description = "Upload file yang di perlukan. klik icon upload sesuai dengan file yang ingin di upload!",
}: Readonly<PengajuanUploadProps>) {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [dokumen, setDokumen] = useState<dokumenType[]>([])

    const form = useForm<z.infer<any>>({
        resolver: zodResolver(pengajuanFileFormSchema),
        // defaultValues: { ...JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\"")) },
        defaultValues: {
            layananFile: ""
        },
    })

    // async function dokumenFetch() {

    //     try {

    //         setIsLoading(true)

    //         const res = await fetch(`/api/dokumen?layanan_id=${id}`)

    //         const data = (await res.json().finally(() => {
    //             setIsLoading(false)
    //         })).data

    //         setDokumen(data)
    //         console.log(data, "dokumen");


    //     } catch (error: unknown) {

    //         console.log(error);

    //     }

    // }

    async function onSubmit(values: z.infer<typeof pengajuanFileFormSchema>) {

        try {
            console.log(values);
            
        } catch {

        }

    }

    // const uploadDokumen = async (e: FormEvent<HTMLInputElement>, dokumen_id: string, update: boolean) => {

    //     const selectedFile = e.currentTarget.files![0];
    //     const inputElement = e.currentTarget;

    //     const formData = new FormData();
    //     formData.append('file', selectedFile, selectedFile.name);
    //     formData.append('ajuan_id', id.toString())
    //     formData.append('dokumen_id', dokumen_id.toString())

    //     try {
    //         const res = await fetch('/api/ajuanDok', {
    //             method: update ? "PATCH" : "POST",
    //             body: formData
    //         });

    //         if (res.ok) {

    //             const resData = await res.json();

    //             const data = resData.data

    //             setDokumen((prevState) => {

    //                 return prevState.map(val => val.dokumen_id === dokumen_id ? {
    //                     ...val,
    //                     ajuan_dok: data
    //                 } : val)
    //             })

    //             toast.success(resData.message)

    //         } else {
    //             console.log("error upload ajuan dok");
    //         }
    //     } finally {
    //         inputElement.value = '';
    //     }

    // }

    // useEffect(() => {
    //     dokumenFetch()
    // }, [])

    useEffect(() => {
    if (!isOpen) {
        form.reset();
    }
}, [isOpen, form])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] sm:max-h-[480px] md:max-h-[720px] max-w-full max-h-full flex" >
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-8 flex flex-col h-auto w-full" >
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 overflow-y-auto">
                            <TableFormField form={form} name="layananFile"
                                InputComponent={({ field }) => (
                                    <input
                                        type="file"
                                        id={field.name}
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        onChange={(e) => {
                                            
                                            console.log(e, 'change');
                                            
                                            field.onChange(e.target.files?.[0])}}
                                        className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 `}
                                    />
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button disabled={isLoading} variant="outline">Batal</Button>
                            </DialogClose>
                            {/* <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Simpan Perubahan"}</Button> */}
                            <Button type="submit" disabled={isLoading} >Upload</Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}