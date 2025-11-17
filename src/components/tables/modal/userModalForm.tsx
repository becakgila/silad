"use client"

import { FormControl, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChevronDownIcon, Table } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import TableFormField from "../TableFormField"
import Select from "@/components/form/Select"
import { useEffect, useState } from "react"

interface FakultasOption {
  value: string;
  label: string;
}

interface ProdiOption {
  value: string;
  label: string;
}

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
      <div className="relative">
           <Select
            options={[
              { value: 'administrator', label: 'Administrator' },
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
  ({ form }) => {
    const [fakultasOptions, setFakultasOptions] = useState<FakultasOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchFakultas = async () => {
        try {
          const response = await fetch('/api/fakultas',{
            cache: 'force-cache'
          });
          const result = await response.json();
          if (result.data) {
            setFakultasOptions(result.data);
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
  ({ form }) => {
    const [prodiOptions, setProdiOptions] = useState<ProdiOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fakultasId = form.watch('fakultas_id');

    useEffect(() => {
      const fetchProdi = async () => {
        try {
          setIsLoading(true);
          console.log(fakultasId, 'fakultas id in user modal form');
          
          const url = fakultasId 
            ? `/api/prodi?fakultas_id=${fakultasId}`
            : '/api/prodi';
          
          const response = await fetch(url);
          const result = await response.json();
          if (result.data) {
            console.log(result.data);
            
            setProdiOptions(result.data);
          }
        } catch (error) {
          console.error('Failed to fetch prodi:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProdi();
    }, [fakultasId]);

    return (
      <TableFormField form={form} name="prodi_id" label="Prodi" InputComponent={({ field }) => (
        <div className="relative">
          <Select
            
            options={isLoading ? [] : prodiOptions}
            {...field}
            defaultValue={field.value}
            placeholder={isLoading ? "Loading..." : "Select Prodi"}
            className="dark:bg-dark-900"
            disabled={isLoading || !fakultasId}
            
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


export default userModalForm;