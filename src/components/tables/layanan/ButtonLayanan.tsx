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

interface HakEditProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    title?: string;
    description?: string;
}


export default function LayananUpload({
    IconButton,
    id,
    title = "Upload Layanan File",
    description = "Upload file yang di perlukan. klik icon upload sesuai dengan file yang ingin di upload!",
}: Readonly<HakEditProps>) {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [dokumen, setDokumen] = useState<dokumenType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function dokumenFetch() {

        try {

            setIsLoading(true)

            const res = await fetch(`/api/dokumen?layanan_id=${id}`)

            const data = (await res.json().finally(() => {
                setIsLoading(false)
            })).data

            setDokumen(data)
            console.log(data, "dokumen");


        } catch (error: unknown) {

            console.log(error);

        }

    }

    const uploadDokumen = async (e: FormEvent<HTMLInputElement>, dokumen_id: string, update: boolean) => {

        const selectedFile = e.currentTarget.files![0];
        const inputElement = e.currentTarget;

        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
        formData.append('ajuan_id', id.toString())
        formData.append('dokumen_id', dokumen_id.toString())

        try {
            const res = await fetch('/api/ajuanDok', {
                method: update ? "PATCH" :"POST",
                body: formData
            });

            if (res.ok) {

                const resData = await res.json();

                const data = resData.data

                setDokumen((prevState) => {                

                    return prevState.map(val => val.dokumen_id === dokumen_id ? {
                        ...val,
                        ajuan_dok: data
                    } : val )
                })                                

                toast.success(resData.message)

            } else {
                console.log("error upload ajuan dok");
            }
        } finally {
            inputElement.value = '';
        }

    }

    useEffect(() => {
        dokumenFetch()
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] sm:max-h-[480px] md:max-h-[720px] max-w-full max-h-full flex" >

                <form className="gap-8 flex flex-col h-auto w-full" >
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 overflow-y-auto">

                        {dokumen.map(data => {

                            // const inputRef = useRef(null);

                            return (
                                <div key={data.dokumen_id}>
                                    <div className="flex justify-between items-center">

                                        <div>
                                            {
                                                data.ajuan_dok ? (
                                                    <>
                                                    <Link className="flex gap-2 items-center" href={data.ajuan_dok.dokumen_url} target="_blank">

                                                        <p className="text-green-600">
                                                            {data.dokumen_name}
                                                        </p>
                                                        <div>
                                                            <CheckCheck className="text-green-600" size={18} />
                                                        </div>
                                                    </Link>
                                                    </>
                                                ) : (<p >
                                                    {data.dokumen_name}
                                                </p>)
                                            }

                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={data.dokumen_template} target="_blank">
                                                <Button size="sm" variant="primary"
                                                    className="bg-green-600" asChild>
                                                    <Eye />
                                                </Button> 
                                            </Link>
                                            <Button asChild onClick={() => {
                                                document.getElementById(`input-${data.dokumen_id}`)?.click()
                                            }} size="sm" variant="primary"
                                                className="bg-brand-500" >
                                                <input
                                                    onInput={(e) => uploadDokumen(e, data.dokumen_id, Boolean(data.ajuan_dok) )}
                                                    type="file" id={`input-${data.dokumen_id}`}
                                                    hidden />

                                                <Paperclip />
                                            </Button>
                                        </div>
                                    </div>

                                    <hr className="mt-3.5" />

                                </div>
                            )
                        })}

                    </div>

                </form>

            </DialogContent>
        </Dialog>
    )
}