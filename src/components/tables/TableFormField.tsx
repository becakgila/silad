import { FormControl, FormField, FormLabel } from "../ui/form"

interface TableFormFieldProps {
    form: any;
    InputComponent: React.FC<{
        field: any;
    }>;
    name: string;
    label: string;
}

const TableFormField : React.FC<TableFormFieldProps> = ({form, InputComponent, name, label}) => {

    return(
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <div className="grid gap-3">
            <div className="flex flex-row justify-between">
              <FormLabel htmlFor={field.name} >{label}</FormLabel>
              {form.formState.errors[field.name] && (
                <div className="text-red-600 text-[0.6rem]">
                  {form.formState.errors[field.name]!.message as string}
                </div>
              )}

            </div>
            <FormControl>
                <InputComponent field={field} />              
            </FormControl>
          </div>
        )}
      />)
}

export default TableFormField;