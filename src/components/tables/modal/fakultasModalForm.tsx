import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import Select from "@/components/form/Select"
import TableFormField from "../TableFormField"
import z from "zod"
import fakultasType from "@/types/model/fakultas"
import dosenType from "@/types/model/dosen"
interface OptionType {
  value: string;
  label: string;
}
const fakultasFormSchema = z.object({

    fakultas_name: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
    fakultas_dekan: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
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
  ({ form }) => {
    const [dekanOptions, setDekanOptions] = useState<OptionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);    

    useEffect(() => {
      const fetchDosen = async () => {
        try {
          const response = await fetch('/api/dosen');
          const result = await response.json();          
          
          if (result.data) {
            const arrOption : OptionType[] = result.data.map((data: dosenType) => ({
              value: data.dosen_id,
              label: data.dosen_name
            }))            
            
            setDekanOptions(arrOption);
          }
        } catch (error) {
          console.error('Failed to fetch dosen:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDosen();
    }, []);

    return (
      <TableFormField form={form} name="fakultas_dekan" label="Dekan" InputComponent={({ field }) => (
        <div className="relative">
          <Select
            options={isLoading ? [] : dekanOptions}
            {...field}
            defaultValue={field.value}
            placeholder={isLoading ? "Loading..." : "Select Dekan"}
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
 
]


export { fakultasFormSchema };

export default fakultasModalForm;