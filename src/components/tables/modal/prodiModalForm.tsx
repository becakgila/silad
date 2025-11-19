import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import z from "zod"
import Select from "@/components/form/Select"
import { useEffect, useState } from "react"
import { prodi_prodi_jenjang } from "@/generated/prisma"
import fakultasType from "@/types/model/fakultas"

interface OptionType {
  value: string;
  label: string;
}

const prodiFormSchema = z.object({

    prodi_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    prodi_jenjang: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    prodi_akreditasi: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    fakultas_id: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    
})

const prodiModulForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [  
  ({ form }) => {
    const [fakultasOptions, setFakultasOptions] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);    

    useEffect(() => {
      const fetchFakultas = async () => {
        try {
          const response = await fetch('/api/fakultas');
          const result = await response.json();          
          
          if (result.data) {
            const arrOption : OptionType[] = result.data.map((data: fakultasType) => ({
              value: data.fakultas_id,
              label: data.fakultas_name
            }))            
            
            setFakultasOptions(arrOption);
          }
        } catch (error) {
          console.error('Failed to fetch fakultas:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFakultas();
    }, []);

    return (
      <TableFormField form={form} name="fakultas_id" label="Fakultas" InputComponent={({ field }) => (
        <div className="relative">
          <Select
            options={isLoading ? [] : fakultasOptions}
            {...field}
            defaultValue={field.value}
            placeholder={isLoading ? "Loading..." : "Select Fakultas"}
            className="dark:bg-dark-900"
            
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon/>
          </span>
        </div>
      )}
      />
    );
  },
  ({ form }) => (
    <TableFormField form={form} name="prodi_name" label="Nama" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="prodi_jenjang" label="Jenjang" InputComponent={({ field }) => (
      <div className="relative">
           <Select
            options={(Object.keys(prodi_prodi_jenjang) as Array<keyof typeof prodi_prodi_jenjang>).map((key) =>({
                label: key,
                value: key,
            }))}
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

  ({ form }) => (
    <TableFormField form={form} name="prodi_akreditasi" label="Akreditasi" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
    )}
    />
  ),
  
 
]


export { prodiFormSchema };

export default prodiModulForm;