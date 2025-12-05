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
import { ArrowRightSquare, CheckCheck, Eye, Paperclip } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "react-toastify"
import TableFormField from "../TableFormField";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

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

    useEffect(() => {
        console.log("level", level);
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[720px] sm:max-h-[480px] md:max-h-[720px] max-w-full max-h-full flex flex-col" >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex justify-between mb-2">
                        <div>Template Prodi</div>
                        <Link target="_blank" href={{
                            pathname: "/admin/designer",
                            query: { level: "prodi", layanan_id: id }
                        }}>
                            <div className="flex items-center gap-2">
                                <p>Designer</p>
                                <ArrowRightSquare />
                            </div>
                        </Link>
                    </div>

                    {level !== "prodi" && (
                        <>
                            <div className="flex justify-between mb-2">
                                <div>Template Fakultas</div>
                                <Link target="_blank" href={{
                                    pathname: "/admin/designer",
                                    query: { level: "fakultas", layanan_id: id }
                                }}>
                                    <div className="flex items-center gap-2">
                                        <p>Designer</p>
                                        <ArrowRightSquare />
                                    </div>
                                </Link>
                            </div>
                            <div className="flex justify-between mb-2">
                                <div>Template Rektorat</div>
                                <Link target="_blank" href={{
                                    pathname: "/admin/designer",
                                    query: { level: "rektorat", layanan_id: id }
                                }}>
                                    <div className="flex items-center gap-2">
                                        <p>Designer</p>
                                        <ArrowRightSquare />
                                    </div>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}