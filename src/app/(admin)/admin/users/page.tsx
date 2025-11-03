"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UsersTable from "@/components/tables/users/UsersTable";

import { Metadata } from "next";
import React from "react";
import listDataType from "@/types/listDataTable";
import { TableCell } from "@/components/ui/table";


const table : {
  headers : any[],
  api: string,
  listData: listDataType[]
} = {
  headers :["no", "nama", "nip", "email", "5", 6, 7, 8, 9, 10, 11, 12, 13],
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
      name: "nip",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.nips}
        </TableCell>
      )
    },
    {
      name: "email",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.email}
        </TableCell>
      )
    },
    {
      name: "nama",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.name}
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
          <UsersTable headers={table.headers} api={table.api} listData={table.listData} />
        </ComponentCard>
      </div>
    </div>
  );
}
