import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import Select from "@/components/form/Select"
import z from "zod"

const dokumenFormSchema = z.object({

    dokumen_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    dokumen_type: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    dokumen_size: z.string().nonempty("Wajib Diisi!!!"),
})

const dokumenModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="dokumen_name" label="Nama Dokumen" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
      
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="dokumen_size" label="Size File Dokumen" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
      
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="dokumen_type" label="Type Dokumen" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
      
    )}
    />
  ),
  
 
]


export { dokumenFormSchema };

export default dokumenModalForm;