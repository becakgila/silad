"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersTable from "@/components/tables/Tables";

import React, { useEffect } from "react";
import listDataType from "@/types/listDataTable";
import { TableCell } from "@/components/ui/table";
import userType from "@/types/model/users";
import ModulsSwitch from "@/components/tables/TablesSwitch";
import TablesEdit from "@/components/tables/TablesEdit";
import Button from "@/components/ui/button/Button";
import { BookIcon, PencilIcon } from "lucide-react";
import TableDelete from "@/components/tables/TablesDelete";
import { TrashBinIcon } from "@/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import userModalForm from "@/components/tables/modal/userModalForm";
import { useTablesStore } from "@/store/useTablesStore";
import HakEdit from "@/components/tables/users/HakEdit";


const api = "/api/users";

const formSchema = z.object({

  name: z.string().nonempty({ message: "Wajib Diisi!!!" }),
  nips: z.string().nullable(),
  email: z.string().nonempty({ message: "Wajib Diisi!!!" }),
  phone: z.string().nullable(),
  level: z.string(),
})



const table: {
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
      name: "Fakultas",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.fakultas?.fakultas_name || '-'}
        </TableCell>
      )
    },
    {
      name: "Prodi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.prodi?.prodi_name || '-'}
        </TableCell>
      )
    },
    {
      name: "No Hp",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.phone || '-'}
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
      name: "Created At",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.created_at ? new Date(table.created_at).toLocaleDateString() : "-"}
        </TableCell>
      )
    },
    {
      name: "Updated At",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.updated_at ? new Date(table.updated_at).toLocaleDateString() : "-"}
        </TableCell>
      )
    },
    {
      name: "Aksi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
          <TablesEdit
            formData={userModalForm}
            id={table.id}
            formSchema={formSchema}
            resolver={zodResolver(formSchema)}
            api={api}
            IconButton={(
              <Button size="sm" variant="primary"
                className="bg-green-600"
              >
                <PencilIcon />
              </Button>
            )}
            data={table}
          />


          <TableDelete api={api} OpenButton={
            (<Button size="sm" variant="primary"
              className="bg-red-500"
            >
              <TrashBinIcon />
            </Button>)
          }
            modulId={table.id}
          />

          <HakEdit id={table.id} IconButton={
            (<Button size="sm" variant="primary"
              
              
            >
              <BookIcon />
            </Button>)
          }
            

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
        <ComponentCard api={table.api}>
          <UsersTable api={table.api} listData={table.listData} />
        </ComponentCard>
      </div>
    </div>
  );
}
