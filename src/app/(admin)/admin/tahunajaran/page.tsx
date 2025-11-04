"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Tables from "@/components/tables/Tables";
import TableDelete from "@/components/tables/TablesDelete";
import TablesEdit from "@/components/tables/TablesEdit";
import TablesSwitch from "@/components/tables/TablesSwitch";
import Button from "@/components/ui/button/Button";

import { TableCell } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";

import listDataType from "@/types/listDataTable";
import tahunajaranType from "@/types/model/tahunajaran";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import React from "react";
import z from "zod";

const api = "/api/tahunajaran";

const formSchema = z.object({

    modul_name: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_url: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_urut: z.string().refine(v => { let n = Number(v); return !Number.isNaN(n) }, {message: "Bukan angka!!!"}).refine(v => { let n = Number(v); return n > 0 }, {message: "Harus lebih dari 0!!!"})    ,
    modul_simbol: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_akses: z.string().nonempty({ message: "Wajib Diisi!!!" }),
})

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
          {table.start_date || '-'}
        </TableCell>
      )
    },
    {
      name: "TANGGAL SELESAI",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.end_date || '-'}
        </TableCell>
      )
    },
    {
      name: "Aksi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
                        {/* <TablesEdit 
                          api={api} 
                          IconButton={(
                            <Button size="sm" variant="primary"
                              className="bg-green-600"
                            >
                                <PencilIcon />
                            </Button>
                          )} 
                          data={table} 
                          formData={[
                            {
                              name: "modul_name",
                              label: "Nama"                              
                            },
                            {
                              name: "modul_url",
                              label: "Url"                              
                            },
                            {
                              name: "modul_urut",
                              label: "Urutan"                              
                            },
                            {
                              name: "modul_simbol",
                              label: "Icon"                              
                            },
                            {
                              name: "modul_akses",
                              label: "Akses"                              
                            },
                          ]}
                          formSchema={formSchema}
                          resolver={zodResolver(formSchema)}
                          id={table.nim}                        
                        /> */}
                        

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
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Mahasiswa" />
      <div className="space-y-6">
        <ComponentCard api={table.api} title="Mahasiswa List" >
          <Tables listData={table.listData} api={table.api} />
        </ComponentCard>
      </div>
    </div>
  );
}
