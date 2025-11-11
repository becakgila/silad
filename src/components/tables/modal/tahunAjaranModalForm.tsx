import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import DatePicker from "@/components/form/date-picker"
import z from "zod"
import Select from "@/components/form/Select"

const formSchema = z.object({

  tahun_awal: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
  tahun_akhir: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
  start_date: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
  end_date: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
  semester: z.string().nonempty({ message: "Wajib Diisi!!!" }).default(""),
})

const tahunAjaranModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="tahun_awal" label="Tahun Awal" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="tahun_akhir" label="Tahun Akhir" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
        value={field.value ?? ""}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="semester" label="Semester" InputComponent={({ field }) => (
      
      <div className="relative">
           <Select
            options={[
              { value: 'gasal', label: 'Gasal' },
              { value: 'genap', label: 'Genap' },
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
  ({ form }) => (
    <TableFormField form={form} name="start_date" label="Tgl Awal" InputComponent={({ field }) => {

      return (
        <DatePicker
          id={field.name}
          field={field}
          defaultDate={field.value ?? ""}
          onChange={(dates, currentDateString) => {
            let isoString = currentDateString;
            if (dates && dates[0] instanceof Date) {
              // Use UTC to avoid timezone shift
              const date = dates[0];
              const dateObj = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
              isoString = dateObj.toISOString();
            } else if (typeof currentDateString === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(currentDateString)) {
              // Parse dd-mm-yyyy format
              const [day, month, year] = currentDateString.split('-');
              const dateObj = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
              isoString = dateObj.toISOString();
            }
            form.setValue(field.name, isoString);
          }}
        />
      )
    }}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="end_date" label="Tgl Akhir" InputComponent={({ field }) => {

      return (
        <DatePicker
          id={field.name}
          field={field}
          defaultDate={field.value ?? ""}
          onChange={(dates, currentDateString) => {
            let isoString = currentDateString;
            if (dates && dates[0] instanceof Date) {
              // Use UTC to avoid timezone shift
              const date = dates[0];
              const dateObj = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
              isoString = dateObj.toISOString();
            } else if (typeof currentDateString === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(currentDateString)) {
              // Parse dd-mm-yyyy format
              const [day, month, year] = currentDateString.split('-');
              const dateObj = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
              isoString = dateObj.toISOString();
            }
            form.setValue(field.name, isoString);
          }}
        />
      )
    }}
    />
  ),

]

export { formSchema };
export default tahunAjaranModalForm;