import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import z from "zod"

const modulFormSchema = z.object({

    modul_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    modul_url: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    modul_urut: z.string().refine(v => { let n = Number(v); return !Number.isNaN(n) }, {message: "Bukan angka!!!"}).refine(v => { let n = Number(v); return n > 0 }, {message: "Harus lebih dari 0!!!"}).default("")    ,
    modul_simbol: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    modul_akses: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
})

const modulModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="modul_name" label="Nama" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="modul_url" label="Url" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="modul_urut" label="Urut" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="modul_simbol" label="Icon" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="modul_akses" label="Akses" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
 
]


export { modulFormSchema };

export default modulModalForm;