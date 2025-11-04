"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Tables from "@/components/tables/Tables";
import TablesSwitch from "@/components/tables/TablesSwitch";
import { TableCell } from "@/components/ui/table";

import listDataType from "@/types/listDataTable";
import modulType from "@/types/model/modul";
import React from "react";

const api = "/api/component/modules";

const table : {  
  api: string,
  listData: listDataType<modulType>[]
} = {  
  api,
  listData: [
    {
      name: "Nama",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.modul_name || "-"}
        </TableCell>
      )
    },
    {
      name: "Url",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.modul_url || '-'}
        </TableCell>
      )
    },
    {
      name: "Icon",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.modul_simbol || '-'}
        </TableCell>
      )
    },
    {
      name: "Hak Akses",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.modul_akses || '-'}
        </TableCell>
      )
    },
    {
      name: "Aktif",
      component: ({ table }) => (
        <TablesSwitch modulId={table.modul_id} api={api} defaultChecked={table.modul_aktif ===  "yes"} field="modul_aktif"/>
          
      )
    },
    {
      name: "New Tab",
      component: ({ table }) => (
        <TablesSwitch modulId={table.modul_id} api={api} defaultChecked={table.modul_newtab ===  "yes"} field="modul_newtab"/>
          
      )
    },
    
  ]

}

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pengaturan Moduls" />
      <div className="space-y-6">
        <ComponentCard title="Moduls List" >
          <Tables listData={table.listData} api={table.api} />
        </ComponentCard>
      </div>
    </div>
  );
}
