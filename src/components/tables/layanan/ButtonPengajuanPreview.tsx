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

interface HakEditProps<T = any> {
    IconButton: React.JSX.Element,
    id: string | number;
    title?: string;
    description?: string;
}


export default function ButtonPengajuanPreview({
    IconButton,
    id,
    title = "Preview File Pengajuan",
    description = "Preview file yang di perlukan. klik icon preview untuk melihat file!",
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
                                                <p >
                                                    {data.dokumen_name}
                                                </p>
                                            }

                                        </div>
                                        <div className="flex gap-2">
                                            {
                                                data.ajuan_dok ? <Link href={data.ajuan_dok.dokumen_url} target="_blank">
                                                    <Button size="sm" variant="primary"
                                                        className="bg-green-600" asChild>
                                                        <Eye />
                                                    </Button>
                                                </Link> : <></>
                                            }


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