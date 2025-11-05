import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"

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


export default modulModalForm;