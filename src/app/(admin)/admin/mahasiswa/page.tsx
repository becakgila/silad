"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Tables from "@/components/tables/Tables";
import TableDelete from "@/components/tables/TablesDelete";
import Button from "@/components/ui/button/Button";
import { TableCell } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";
import { useTablesStore } from "@/store/useTablesStore";
import listDataType from "@/types/listDataTable";
import mahasiswaType from "@/types/model/mahasiswa";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import z from "zod";

const api = "/api/mahasiswa";

const formSchema = z.object({

    modul_name: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_url: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_urut: z.string().refine(v => { let n = Number(v); return !Number.isNaN(n) }, {message: "Bukan angka!!!"}).refine(v => { let n = Number(v); return n > 0 }, {message: "Harus lebih dari 0!!!"})    ,
    modul_simbol: z.string().nonempty({ message: "Wajib Diisi!!!" }),
    modul_akses: z.string().nonempty({ message: "Wajib Diisi!!!" }),
})

const table : {  
  api: string,
  listData: listDataType<mahasiswaType>[]
} = {  
  api,
  listData: [
    {
      name: "NIM",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.nim || "-"}
        </TableCell>
      )
    },
    {
      name: "NAMA",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.nama || '-'}
        </TableCell>
      )
    },
    {
      name: "PRODI",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.prodi || '-'}
        </TableCell>
      )
    },
    {
      name: "ANGLKATAN",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.angkatan || '-'}
        </TableCell>
      )
    },
    {
      name: "JENIS KELAMIN",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.jenis_kelamin || '-'}
        </TableCell>          
      )
    },
    {
      name: "TEMPAT LAHIR",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.tempat_lahir || '-'}
        </TableCell>        
      )
    },
     {
      name: "TANGGAL LAHIR",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.tanggal_lahir ? new Date(table.tanggal_lahir).toLocaleDateString() : "-"  }
        </TableCell>        
      )
    },
     {
      name: "AGAMA",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.agama || '-'}
        </TableCell>        
      )
    },
     {
      name: "HP",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.no_hp || '-'}
        </TableCell>        
      )
    },
     {
      name: "JALUR MASUK",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.jalur_masuk || '-'}
        </TableCell>        
      )
    },
     {
      name: "ALAMAT",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.alamat || '-'}
        </TableCell>        
      )
    },
     {
      name: "PROVINSI",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.provinsi || '-'}
        </TableCell>        
      )
    },
    {
      name: "Aksi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">                      
                        

                        <TableDelete api={api} OpenButton={
                            (<Button size="sm" variant="primary"
                                className="bg-red-500"
                            >
                                <TrashBinIcon />
                            </Button>)
                        }
                            modulId={table.nim}
                        />
                    </TableCell>
      )
    },
    
    
  ]

}

export default function BasicTables() {
  
  const setLastPath = useTablesStore(state => state.setLastPath);
  const pathname = usePathname();
  
  useEffect(() => {
    
    setLastPath(pathname);
  }, [pathname]);

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
