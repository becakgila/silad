"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersTable from "@/components/tables/users/UsersTable";
import React from "react";
import listDataType from "@/types/listDataTable";
import { TableCell } from "@/components/ui/table";
import ModulsSwitch from "@/components/tables/users/ModulsSwitch";


const table : {
  api: string,
  listData: listDataType[]
} = {
  
  api: "/api/users",
  listData: [
    {
      name: "Nama",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.name}
        </TableCell>
      )
    },
    {
      name: "NIP",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.nips || "-" }
        </TableCell>
      )
    },
    {
      name: "Email",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.email}
        </TableCell>
      )
    },
    {
      name: "No HP",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.phone || "-"}
        </TableCell>
      )
    },
    {
      name: "Level",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.level}
        </TableCell>
      )
    },
    {
      name: "Fakultas_id",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.fakultas_id}
        </TableCell>
      )
    },
    {
      name: "Prodi Id",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.prodi_id}
        </TableCell>
      )
    },
    {
      name: "Status",
      component: ({ table }) => (
        <ModulsSwitch defaultChecked={table.status === 'yes'} modulId={table.id} field="status" />
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
                        {new Date(table.created_at).toLocaleDateString()}
                    </TableCell>
      )
    },
    {
      name: "Updated At",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(table.updated_at).toLocaleDateString()}
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
