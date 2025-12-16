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
import { FormEvent, useEffect, useState } from "react"
import Button from "@/components/ui/button/Button";
import { useForm } from "react-hook-form"
import z, { set } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { numberToProgress } from "@/variable/progressNumber"
import ViewerPdfme from "@/components/pdf-me/ViewerPdfme"
import { useSession } from "next-auth/react"

interface PengajuanUploadProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    idLayanan: string;
    progress: number;
    title?: string;
    description?: string;
    nama: string;
    nim: string;
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
    nama,
    onSubmitFinish = () => { },
    title = "Upload Pengajuan File",
    description = "Upload file yang di perlukan. klik icon upload sesuai dengan file yang ingin di upload!",
}: Readonly<PengajuanUploadProps>) {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [template, setTemplate] = useState<any>(null)

    async function getTemplate() {
        try {
            setIsLoading(true)

            const level = numberToProgress[progress];

            const req = await fetch(`/api/layananTemplate?template_name=${level}&layanan_id=${idLayanan}`);

            if (req.ok) {

                const res = await req.json();
                const data = res.data;
                // console.log(data[0].template_url, "ini template layanan");
                setTemplate(data[0].template_url);

            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        console.log("Template url:", template);
    }, [template]);

    useEffect(() => {
        if (!isOpen) {
            // form.reset();
        } else {
            getTemplate()
        }
    }, [isOpen])

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setIsLoading(true);

            const formData = new FormData(event.currentTarget);

            const formValues = Object.fromEntries(formData.entries());

            console.log(formValues, "onsubmit");

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent >
                <form onSubmit={(val) => {

                    onSubmit(val);

                }}>

                    <div className=" max-w-full max-h-full">

                        <div className="gap-8 flex flex-col h-auto w-full" >
                            <DialogHeader>
                                <DialogTitle>{title}</DialogTitle>
                                <DialogDescription>
                                    {description}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 h-full  overflow-auto">
                                <ViewerPdfme nama={nama} template={template} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button disabled={isLoading} variant="outline">Batal</Button>
                                </DialogClose>
                                {/* <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Simpan Perubahan"}</Button> */}
                                <Button type="submit" disabled={isLoading} >Upload</Button>
                            </DialogFooter>

                        </div>
                    </div>



                </form>
            </DialogContent>
        </Dialog>
    )
}