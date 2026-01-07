import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import z from "zod"
import Select from "@/components/form/Select"
import { moduls_modul_akses } from "@/generated/prisma"

const modulFormSchema = z.object({

    modul_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    modul_url: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    modul_urut: z.string().refine(v => { const n = Number(v); return !Number.isNaN(n) }, {message: "Bukan angka!!!"}).refine(v => { const n = Number(v); return n > 0 }, {message: "Harus lebih dari 0!!!"}).default("")    ,
    modul_simbol: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    modul_akses: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
})

const modulModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="modul_name" label="Nama" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value || ""}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="modul_url" label="Url" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value || ""}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="modul_urut" label="Urut" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value || ""}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="modul_simbol" label="Icon" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value || ""}
      />
    )}
    />
  ),
  ({ form }) => (
    
    <TableFormField form={form} name="modul_akses" label="Akses" InputComponent={({ field }) => (
      
      <div className="relative">
           <Select
            options={
              (Object.keys(moduls_modul_akses) as Array<keyof typeof moduls_modul_akses>).map(key => ({
                label: key,
                value: key,
              }))
              
            }
            {...field}
            
            defaultValue={field.value}
            // onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
         </div>
    )}
    />    
    
  ),
 
]


export { modulFormSchema };

export default modulModalForm;