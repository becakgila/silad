import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import DatePicker from "@/components/form/date-picker"
import { fi } from "zod/v4/locales"
// import DatePicker from "@/components/ui/date-picker"

const tahunAjaranModalForm: React.FC<{ form: UseFormReturn<any, any, any> }>[] = [
  ({ form }) => (
    <TableFormField form={form} name="tahun_awal" label="Tahun Awal" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="tahun_awal" label="Tahun Akhir" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="semester" label="Semester" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="start_date" label="Tgl Awal" InputComponent={({ field }) => { 
      
      return (
      <DatePicker
                  id={field.name}
                  {...field}
                  defaultDate={field.value}
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
    )}}
    />
  ),
  ({ form }) => (
    <TableFormField form={form} name="end_date" label="Tgl Akhir" InputComponent={({ field }) => (
      <Input
        id={field.name}
        {...field}
      />
    )}
    />
  ),
 
]


export default tahunAjaranModalForm;