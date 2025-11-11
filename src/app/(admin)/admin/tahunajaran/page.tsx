"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import tahunAjaranModalForm, { formSchema } from "@/components/tables/modal/tahunAjaranModalForm";
import Tables from "@/components/tables/Tables";
import TableDelete from "@/components/tables/TablesDelete";
import TablesEdit from "@/components/tables/TablesEdit";
import Button from "@/components/ui/button/Button";
import { TableCell } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";
import { useTablesStore } from "@/store/useTablesStore";
import listDataType from "@/types/listDataTable";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import tahunajaranType from "@/types/model/tahunajaran";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import z from "zod";

const api = "/api/tahunajaran";

const table : {  
  api: string,
  listData: listDataType<tahunajaranType>[]
} = {  
  api,
  listData: [
    {
      name: "TAHUN AJARAN",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.tahun_awal +"/"+table.tahun_akhir|| "-"}
        </TableCell>
      )
    },
    {
      name: "SEMESTER",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.semester || '-'}
        </TableCell>
      )
    },
    {
      name: "TANGGAL MULAI",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.start_date ? new Date(table.start_date).toLocaleDateString() : "-"  }
        </TableCell>
      )
    },
    {
      name: "TANGGAL SELESAI",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.end_date ? new Date(table.end_date).toLocaleDateString() : "-"  }
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
                          formData={tahunAjaranModalForm}
                          formSchema={formSchema}
                          resolver={zodResolver(formSchema)}
                          id={table.tahun_ajaran_id}                          
                        />
                        

                        <TableDelete api={api} OpenButton={
                            (<Button size="sm" variant="primary"
                                className="bg-red-500"
                            >
                                <TrashBinIcon />
                            </Button>)
                        }
                            modulId={table.tahun_ajaran_id}
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
      <PageBreadcrumb pageTitle="Data Tahun Ajaran" />
      <div className="space-y-6">
        <ComponentCard api={table.api} add={
          {
            api: table.api,
            formData: tahunAjaranModalForm,
            formSchema: formSchema,
            resolver: zodResolver(formSchema)
          }
        } >
          <Tables listData={table.listData} api={table.api} />
        </ComponentCard>
      </div>
    </div>
  );
}
