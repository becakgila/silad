import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import z from "zod"

const fakultasFormSchema = z.object({

    fakultas_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
})

const fakultasModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="fakultas_name" label="Fakultas" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
    )}
    />
  ),
 
]


export { fakultasFormSchema };

export default fakultasModalForm;