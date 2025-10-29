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
import Modul from "@/type/model/modul"
import { FormEvent, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form"
import * as z from "zod";
import { useForm } from "react-hook-form"

interface ModulsEditProps {
    IconButton: React.JSX.Element,
    data: Modul
}

const formSchema = z.object({
    modul_name: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_url: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_urut: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_simbol: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_akses: z.string().nonempty({ message: "Wajib Diisi!!!" }),
})


export default function ModulsEdit({ IconButton, data }: ModulsEditProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        modul_id, modul_url, modul_urut, modul_simbol, modul_name, modul_akses
    } = data;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            modul_name,
            modul_url,
            modul_urut,
            modul_simbol,
            modul_akses
        },
    })



    async function onSubmit(values: z.infer<typeof formSchema>) {

        setIsLoading(true) // Set loading to true when the request starts



        try {
            //   const formData = new FormData(event.currentTarget)            
            console.log(values);


            //   const response = await fetch(`/api/component/modul/${modul_id}`, {
            //     method: 'POST',
            //     body: formData,
            //   })

            // Handle response if necessary
            //   const data = await response.json()
            // ...
        } catch (error) {
            // Handle error if necessary
            console.error(error)
        } finally {
            setIsLoading(false) // Set loading to false when the request completes
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {IconButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] ">
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-8 flex flex-col" >
                        <DialogHeader>
                            <DialogTitle>Edit Modul</DialogTitle>
                            <DialogDescription>
                                Buat perubahan pada modul di sini. Klik simpan ketika sudah melakukan perubahan.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">

                            <FormField
                                control={form.control}
                                name="modul_name"
                                render={({ field }) => (

                                    <div className="grid gap-3">
                                        <div className="flex flex-row justify-between">
                                            <FormLabel htmlFor={field.name}>Nama</FormLabel>
                                            {form.formState.errors.modul_name && (
                                                <div className="text-red-600 text-[0.6rem]">
                                                    {form.formState.errors.modul_name.message}
                                                </div>
                                            )}

                                        </div>
                                        <FormControl>
                                            <Input id={field.name} {...field} />
                                        </FormControl>



                                    </div>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="modul_url"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <div className="flex flex-row justify-between">
                                            <FormLabel htmlFor={field.name}>Url</FormLabel>
                                            {form.formState.errors.modul_url && (
                                                <div className="text-red-600 text-[0.6rem]">
                                                    {form.formState.errors.modul_url.message}
                                                </div>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input id={field.name} {...field} />
                                        </FormControl>

                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="modul_urut"
                                render={({ field }) => (
                                    <div className="grid gap-3">
                                        <div className="flex flex-row justify-between">

                                            <FormLabel htmlFor={field.name}>Urutan</FormLabel>
                                            {form.formState.errors.modul_urut && (
                                                <div className="text-red-600 text-[0.6rem]">
                                                    {form.formState.errors.modul_urut.message}
                                                </div>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input id={field.name} {...field} />
                                        </FormControl>

                                    </div>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="modul_simbol"
                                render={({ field }) => (

                                    <div className="grid gap-3">
                                        <div className="flex flex-row justify-between">

                                            <FormLabel htmlFor={field.name}>Icon (font awesome)</FormLabel>
                                            {form.formState.errors.modul_simbol && (
                                                <div className="text-red-600 text-[0.6rem]">
                                                    {form.formState.errors.modul_simbol.message}
                                                </div>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input id={field.name} {...field} />
                                        </FormControl>
                                    </div>

                                )}
                            />
                            <FormField
                                control={form.control}
                                name="modul_akses"
                                render={({ field }) => (

                                    <div className="grid gap-3">
                                        <div className="flex flex-row justify-between">

                                            <FormLabel htmlFor={field.name}>Hak akses</FormLabel>
                                            {form.formState.errors.modul_akses && (
                                                <div className="text-red-600 text-[0.6rem]">
                                                    {form.formState.errors.modul_akses.message}
                                                </div>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Input id={field.name} {...field} />
                                        </FormControl>
                                    </div>

                                )}
                            />

                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
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