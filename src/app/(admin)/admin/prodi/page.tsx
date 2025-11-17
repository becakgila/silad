"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import prodiModalForm, { prodiFormSchema } from "@/components/tables/modal/prodiModalForm";
import Tables from "@/components/tables/Tables";
import TableDelete from "@/components/tables/TablesDelete";
import TablesEdit from "@/components/tables/TablesEdit";
import TablesSwitch from "@/components/tables/TablesSwitch";
import Button from "@/components/ui/button/Button";

import { TableCell } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";
import { useTablesStore } from "@/store/useTablesStore";

import listDataType from "@/types/listDataTable";
import prodiType from "@/types/model/prodi";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { use, useEffect } from "react";


const api = "/api/prodi";

const table: {
  api: string,
  listData: listDataType<prodiType>[]
} = {
  api,
  listData: [
    {
      name: "Nama",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.prodi_name || "-"}
        </TableCell>
      )
    },
    {
      name: "Jenjang",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.prodi_jenjang || '-'}
        </TableCell>
      )
    },
    {
      name: "Akreditasi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.prodi_akreditasi || '-'}
        </TableCell>
      )
    },
    {
      name: "fakultas",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.fakultas.fakultas_name || '-'}
        </TableCell>
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
            formData={prodiModalForm}
            formSchema={prodiFormSchema}
            resolver={zodResolver(prodiFormSchema)}
            id={table.prodi_id}
            idLabel="prodi_id"
          />


          <TableDelete api={api} OpenButton={
            (<Button size="sm" variant="primary"
              className="bg-red-500"
            >
              <TrashBinIcon />
            </Button>)
          }
            modulId={table.prodi_id}
            idLabel="prodi_id"
          />
        </TableCell>
      )
    },
  ]
}

export default function BasicTables() {


  const setTableDefault = useTablesStore(state => state.setTablesDefault);
  const setLastPath = useTablesStore(state => state.setLastPath);
  const pathname = usePathname();

  useEffect(() => {
    setTableDefault();
    setLastPath(pathname);
  }, [pathname]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Pengaturan Prodi" />
      <div className="space-y-6">
        <ComponentCard api={table.api} add={
          {
            api: table.api,
            formData: prodiModalForm,
            formSchema: prodiFormSchema,
            resolver: zodResolver(prodiFormSchema)
          }
        } >
          <Tables listData={table.listData} api={table.api}  />
        </ComponentCard>
      </div>
    </div>
  );
}
