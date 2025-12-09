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
import { log, table } from "console"
import dokumenType from "@/types/model/dokumen"
import { CheckCheck, Eye, Paperclip, ScrollText } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "react-toastify"
import TableFormField from "../TableFormField"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import ajuanStatusType from "@/types/model/ajuanStatus"
import DesignerPage from "@/components/pdf-me/DesignerPage"
import { numberToProgress, progressToNumber } from "@/variable/progressNumber"
import ViewerPdfme from "@/components/pdf-me/ViewerPdfme"

interface PengajuanUploadProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    idLayanan: string;
    progress: number;
    title?: string;
    description?: string;
    onSubmitFinish?: (progress: number) => void;
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
    idLayanan,
    progress,
    onSubmitFinish = () => { },
    title = "Upload Pengajuan File",
    description = "Upload file yang di perlukan. klik icon upload sesuai dengan file yang ingin di upload!",
}: Readonly<PengajuanUploadProps>) {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [template, setTemplate] = useState<any>(null)    


    const form = useForm<z.infer<any>>({
        resolver: zodResolver(pengajuanFileFormSchema),
        // defaultValues: { ...JSON.parse(JSON.stringify(data).replace(/\:null/gi, "\:\"\"")) },
        defaultValues: {
            layananFile: ""
        },
    })

    // async function onSubmit(values: z.infer<typeof pengajuanFileFormSchema>) {

    //     try {
    //         setIsLoading(true)

    //         const form = new FormData()

    //         form.append("file", values.layananFile)
    //         form.append("ajuan_id", id.toString())
    //         form.append("progress", progress.toString())

    //         const fetchData = await fetch('/api/ajuanStatus', {
    //             method: "POST",
    //             body: form
    //         })

    //         const fetchJson = await fetchData.json()

    //         const data: ajuanStatusType = fetchJson.data

    //         onSubmitFinish(data.progress)

    //     } catch {

    //     } finally {
    //         setIsLoading(false)
    //     }

    // }

    async function getTemplate() {
        try{
            setIsLoading(true)
            
            const level = numberToProgress[progress];

           
            const req = await fetch(`/api/layananTemplate?template_name=${level}&layanan_id=${idLayanan}`);

            if (req.ok) {

                const res = await req.json();
                const data = res.data;
                if (data.length !== 0) {

                    
                    const fetchJson = await fetch(data[0].template_url)
                    const dataTemplate = await fetchJson.json()                    
                    setTemplate(dataTemplate)
                                        
                }
            }
        }catch(error){
            console.log(error);            
        }finally{
            setIsLoading(false)
        }

    }

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        } else {
            getTemplate()
        }
    }, [isOpen, form])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] sm:max-h-[480px] md:max-h-[720px] max-w-full max-h-full flex" >

                <div className="gap-8 flex flex-col h-auto w-full" >                  
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 h-full overflow-auto">
                        <ViewerPdfme template={template} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isLoading} variant="outline">Batal</Button>
                        </DialogClose>
                        {/* <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Simpan Perubahan"}</Button> */}
                        <Button type="submit" disabled={isLoading} >Upload</Button>
                    </DialogFooter>

                </div>


            </DialogContent>
        </Dialog>
    )
}