import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import Select from "@/components/form/Select"
import z from "zod"

const layananFormSchema = z.object({

    layanan_jenis: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    layanan_lvl: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
})

const layananModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="layanan_jenis" label="Jenis Layanan" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
      
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="layanan_lvl" label="Petugas Layanan" InputComponent={({ field }) => (
      <div className="relative">
           <Select
            options={[
              { value: 'rektorat', label: 'rektorat' },
              { value: 'prodi', label: 'Prodi' },
            ]}
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


export { layananFormSchema };

export default layananModalForm;