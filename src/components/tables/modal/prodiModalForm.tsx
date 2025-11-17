import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import z from "zod"

const prodiFormSchema = z.object({

    prodi_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    prodi_jenjang: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    prodi_akreditasi: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    fakultas_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
})

const prodiModulForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="prodi_name" label="Nama" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="prodi_jenjang" label="Url" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="prodi_akreditasi" label="Urut" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="fakultas_name" label="Icon" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
 
]


export { prodiFormSchema };

export default prodiModulForm;