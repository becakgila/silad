import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import Select from "@/components/form/Select"
import z from "zod"
import FileInput from "@/components/form/input/FileInput"

const dokumenFormSchema = z.object({

    dokumen_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    dokumen_type: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    dokumen_size: z.union([
      z.string().nonempty("Wajib Diisi!!!").refine((s) => /^\d+(?:\.\d+)?$/.test(s), { message: "Harus berupa angka" }),
      z.number()
    ])
  .transform(val => String(val)),
    // allow either an uploaded File or an existing string path (or empty)
    dokumen_template: z.union([z.instanceof(File), z.string()]).optional().nullable()
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
    <TableFormField form={form} name="dokumen_size" label="Size File Maksimal Dokumen (MB)" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={String(field.value ?? "")}
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
  ({ form }) => (
    <TableFormField form={form} name="dokumen_template" label="Template Dokumen" InputComponent={({ field }) => (
      <input
        type="file"
        id={field.name}
        name={field.name}
        onBlur={field.onBlur}
        ref={field.ref}
        onChange={(e) => field.onChange(e.target.files?.[0] ?? undefined)}
        className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 `}
      />      
    )}
    />
  ),
  
]


export { dokumenFormSchema };

export default dokumenModalForm;