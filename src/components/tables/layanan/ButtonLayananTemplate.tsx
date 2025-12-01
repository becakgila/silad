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

import { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import Button from "@/components/ui/button/Button";
import dokumenType from "@/types/model/dokumen"
import { CheckCheck, Eye, Paperclip } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "react-toastify"
import TableFormField from "../TableFormField";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";


const formSchema = (isProdi: boolean) => isProdi ? z.object({
    template_prodi: z.instanceof(File),
}) : z.object({
    template_prodi: z.instanceof(File),
    template_fakultas: z.instanceof(File),
    template_rektorat: z.instanceof(File),
})

interface ButtonLayananTemplateProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    title?: string;
    description?: string;
    level: string;
}

export default function ButtonLayananTemplate({
    IconButton,
    id,
    title = "Dokumen Template Layanan",
    description = "Upload File Template Untuk Layanan",
    level
}: Readonly<ButtonLayananTemplateProps>) {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [dokumen, setDokumen] = useState<dokumenType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm({
        resolver: zodResolver(formSchema(level.toLowerCase() === 'prodi'))
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            const formData = new FormData;

            Object.keys(values as any).forEach((key) => {
                formData.append(key, (values as any)[key])
            })

            formData.append('layanan_id', id.toString())

            const req = fetch("/api/layananTemplate", {
                body: formData,
                method: "POST",
            })

        } catch (error) {
            console.log(error)
        }
    }    

    useEffect(() => {

    }, [])

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen, form])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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



                            <TableFormField form={form} name="template_prodi" label="Template Prodi" InputComponent={({ field }) => (
                                <input
                                    type="file"
                                    id={field.name}
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                                    className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 `}
                                />
                            )} />

                        </div>

                        {
                            level.toLowerCase() !== 'prodi' && (
                                <>
                                    <TableFormField form={form} name="template_fakultas" label="Template Fakultas" InputComponent={({ field }) => (
                                        <input
                                            type="file"
                                            id={field.name}
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                                            className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 `}
                                        />
                                    )} />
                                    <TableFormField form={form} name="template_rektorat" label="Template Rektorat" InputComponent={({ field }) => (
                                        <input
                                            type="file"
                                            id={field.name}
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
                                            className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 `}
                                        />
                                    )} />

                                </>
                            )
                        }


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