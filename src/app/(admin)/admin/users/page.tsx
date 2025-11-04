"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersTable from "@/components/tables/Tables";

import React from "react";
import listDataType from "@/types/listDataTable";
import { TableCell } from "@/components/ui/table";
import userType from "@/types/model/users";
import ModulsSwitch from "@/components/tables/TablesSwitch";
import TablesEdit from "@/components/tables/TablesEdit";
import Button from "@/components/ui/button/Button";
import { PencilIcon } from "lucide-react";
import TableDelete from "@/components/tables/TablesDelete";
import { TrashBinIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";


const api = "/api/users";

const formSchema = z.object({

  name: z.string().nonempty({ message: "Wajib Diisi!!!" }),
  nips: z.string().nullable(),
  email: z.string().nonempty({ message: "Wajib Diisi!!!" }),
  phone: z.string().nullable(),
  level: z.string(),
  // modul_url: z.string().nonempty({ message: "Wajib Diisi!!!" }),
  // modul_urut: z.string().refine(v => { let n = Number(v); return !Number.isNaN(n) }, {message: "Bukan angka!!!"}).refine(v => { let n = Number(v); return n > 0 }, {message: "Harus lebih dari 0!!!"})    ,
    // modul_simbol: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    // modul_akses: z.string().nonempty({ message: "Wajib Diisi!!!" }),
})

const table : {  
  api: string,
  listData: listDataType<userType>[]
} = {  
  api: api,
  listData: [
    {
      name: "Nama",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.name || "-"}
        </TableCell>
      )
    },
    {
      name: "Nip",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.nips || '-'}
        </TableCell>
      )
    },
    {
      name: "Email",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.email || '-'}
        </TableCell>
      )
    },
    {
      name: "No Hp",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.phone || '-' }
        </TableCell>
      )
    },
    {
      name: "Status",
      component: ({ table }) => (
        <ModulsSwitch api={api} defaultChecked={table.status === 'yes'} modulId={table.id} field="status" />
      )
    },
    {
      name: "Email Verified At",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {table.email_verified_at ? new Date(table.email_verified_at).toLocaleDateString() : "-"  }
                    </TableCell>
      )
    },
    {
      name: "Created At",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {table.created_at ? new Date(table.created_at).toLocaleDateString() : "-"  }
                    </TableCell>
      )
    },
    {
      name: "Updated At",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {table.updated_at ? new Date(table.updated_at).toLocaleDateString() : "-"  }
                    </TableCell>
      )
    },
    {
      name: "Aksi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
                        <TablesEdit formData={
                          [
                            {
                              label: "Nama",
                              name: "name"
                            },
                            {
                              label: "NIP",
                              name: "nips"
                            },
                            {
                              label: "Email",
                              name: "email"
                            },
                            {
                              label: "No Hp",
                              name: "phone"
                            },
                            {
                              label: "Level",
                              name: "level"
                            },
                          ]
                        } id={table.id} formSchema={formSchema} resolver={zodResolver(formSchema)} api={api} IconButton={(<Button size="sm" variant="primary"
                            className="bg-green-600"
                        >
                            <PencilIcon />
                        </Button>)} data={ table } />
                        

                        <TableDelete api={api} OpenButton={
                            (<Button size="sm" variant="primary"
                                className="bg-red-500"
                            >
                                <TrashBinIcon />
                            </Button>)
                        }
                            modulId={table.id}
                        />
                    </TableCell>
      )
    },
    
  ]

}


export default function BasicTables() {

  

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard api={table.api} title="Users List" >
          <UsersTable api={table.api} listData={table.listData} />
        </ComponentCard>
      </div>
    </div>
  );
}
