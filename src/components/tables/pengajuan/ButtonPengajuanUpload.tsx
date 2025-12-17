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
import { mahasiswa } from "@/generated/prisma";
import mahasiswaType from "@/types/model/mahasiswa";

interface PengajuanUploadProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    idLayanan: string;
    progress: number;
    title?: string;
    description?: string;
    mahasiswa?: mahasiswaType;
    onSubmitFinish?: (progress: number) => void;
}

export default function PengajuanUpload({
    IconButton,
    id,
    idLayanan,
    progress,
    mahasiswa,
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

            formData.append('ajuan_id', id.toString());
            formData.append('progress', (progress).toString());

            const res = await fetch('/api/ajuanStatus', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {

                setIsOpen(false);
                onSubmitFinish(progress);
                console.log('File uploaded successfully');

            } else {
                console.error('Failed to upload file');
            }

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
                                <ViewerPdfme mahasiswa={mahasiswa} template={template} />
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