import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"

const userModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="name" label="Nama" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="nips" label="NIP" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="email" label="Email" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="phone" label="No Hp" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="level" label="level" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
]


export default userModalForm;