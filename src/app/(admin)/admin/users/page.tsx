"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersTable from "@/components/tables/Tables";

import React from "react";
import listDataType from "@/types/listDataTable";
import { TableCell } from "@/components/ui/table";
import userType from "@/types/model/users";


const table : {  
  api: string,
  listData: listDataType<userType>[]
} = {  
  api: "/api/users",
  listData: [
    {
      name: "nama",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.name}
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
          {table.email}
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
  ]

}


export default function BasicTables() {

  

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="Users List" >
          <UsersTable api={table.api} listData={table.listData} />
        </ComponentCard>
      </div>
    </div>
  );
}
