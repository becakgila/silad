"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import fakultasModalForm, { fakultasFormSchema } from "@/components/tables/modal/fakultasModalForm";
import Tables from "@/components/tables/Tables";
import TableDelete from "@/components/tables/TablesDelete";
import TablesEdit from "@/components/tables/TablesEdit";
import TablesSwitch from "@/components/tables/TablesSwitch";
import Button from "@/components/ui/button/Button";

import { TableCell } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";
import { useTablesStore } from "@/store/useTablesStore";

import listDataType from "@/types/listDataTable";
import fakultasType from "@/types/model/fakultas";
import modulType from "@/types/model/modul";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { use, useEffect } from "react";


const api = "/api/fakultas";

const table: {
  api: string,
  listData: listDataType<fakultasType>[]
} = {
  api,
  listData: [
    {
      name: "Fakultas",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.fakultas_name || "-"}
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
            formData={fakultasModalForm}
            formSchema={fakultasFormSchema}
            resolver={zodResolver(fakultasFormSchema)}
            id={table.fakultas_id}
            idLabel="fakultas_id"
          />


          <TableDelete api={api} OpenButton={
            (<Button size="sm" variant="primary"
              className="bg-red-500"
            >
              <TrashBinIcon />
            </Button>)
          }
            modulId={table.fakultas_id}
            idLabel="fakultas_id"
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
      <PageBreadcrumb pageTitle="Pengaturan Fakultas" />
      <div className="space-y-6">
        <ComponentCard api={table.api} add={
          {
            api: table.api,
            formData: fakultasModalForm,
            formSchema: fakultasFormSchema,
            resolver: zodResolver(fakultasFormSchema)
          }
        } >
          <Tables listData={table.listData} api={table.api}  />
        </ComponentCard>
      </div>
    </div>
  );
}
