"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import modulModalForm, { modulFormSchema } from "@/components/tables/modal/modulModalForm";
import Tables from "@/components/tables/Tables";
import TableDelete from "@/components/tables/TablesDelete";
import TablesEdit from "@/components/tables/TablesEdit";
import TablesSwitch from "@/components/tables/TablesSwitch";
import Button from "@/components/ui/button/Button";

import { TableCell } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";

import listDataType from "@/types/listDataTable";
import modulType from "@/types/model/modul";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import React from "react";


const api = "/api/component/modules";

const table: {
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
        <TablesSwitch modulId={table.modul_id} api={api} defaultChecked={table.modul_aktif === "yes"} field="modul_aktif" />

      )
    },
    {
      name: "New Tab",
      component: ({ table }) => (
        <TablesSwitch modulId={table.modul_id} api={api} defaultChecked={table.modul_newtab === "yes"} field="modul_newtab" />
      )
    },
    {
      name: "Aksi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
          <TablesEdit
            api={api}
            IconButton={(
              <Button size="sm" variant="primary"
                className="bg-green-600"
              >
                <PencilIcon />
              </Button>
            )}
            data={table}
            formData={modulModalForm}
            formSchema={modulFormSchema}
            resolver={zodResolver(modulFormSchema)}
            id={table.modul_id}
          />


          <TableDelete api={api} OpenButton={
            (<Button size="sm" variant="primary"
              className="bg-red-500"
            >
              <TrashBinIcon />
            </Button>)
          }
            modulId={table.modul_id}
          />
        </TableCell>
      )
    },
  ]
}

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pengaturan Moduls" />
      <div className="space-y-6">
        <ComponentCard api={table.api} title="Moduls List" >
          <Tables listData={table.listData} api={table.api} />
        </ComponentCard>
      </div>
    </div>
  );
}
