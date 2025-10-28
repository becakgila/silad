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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,    
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Modul from "@/type/model/modul"
import { FormEvent, useState } from "react"

interface ModulsEditProps {
    IconButton: React.JSX.Element,
    data: Modul
}

export default function ModulsEdit({ IconButton, data }: ModulsEditProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
 
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true) // Set loading to true when the request starts
 
    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })
 
      // Handle response if necessary
      const data = await response.json()
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
            <form>
                <DialogTrigger asChild>
                    {IconButton}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] ">
                    <DialogHeader>
                        <DialogTitle>Edit Modul</DialogTitle>
                        <DialogDescription>
                            Buat perubahan pada modul di sini. Klik simpan ketika sudah melakukan perubahan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="modul_name">Nama Modul</Label>
                            <Input id="modul_name" name="modul_name" defaultValue={data.modul_name} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="modul_url">Url</Label>
                            <Input id="modul_url" name="modul_url" defaultValue={data.modul_url} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="modul_urut">Urutan</Label>
                            <Input id="modul_urut" name="modul_urut" defaultValue={data.modul_urut} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="modul_simbol">Icon</Label>
                            <Input id="modul_simbol" name="modul_simbol" defaultValue={data.modul_simbol} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="modul_akses">Hak Akses</Label>
                            <Input id="modul_akses" name="modul_akses" defaultValue={data.modul_akses} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="modul_aktif">Aktif</Label>
                            <Select defaultValue={data.modul_aktif} name="aktif">
                                <SelectTrigger id="modul_aktif" className="w-full">
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="modul-newTab">New Tab</Label>
                            <Select defaultValue={data.modul_newtab} name="newTab">
                                <SelectTrigger id="modul-newTab" className="w-full">
                                    <SelectValue placeholder="Select a fruit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Simpan Perubahan"}</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}