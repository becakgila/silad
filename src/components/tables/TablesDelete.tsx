"use client"

import * as onConfirmAction from "@/actions/tables/deleteTable";
import { AlertDialogFooter, AlertDialogHeader, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useTablesStore } from "@/store/useTablesStore";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

type Props = {
  OpenButton?: React.JSX.Element;
  modulId: string;
  api: string;
}


const TableDelete = ({ OpenButton, modulId, api }: Props) => {

  const setTables = useTablesStore((state) => state.setTables)
  const tables = useTablesStore((state) => state.tables)

  const onConfirm = async (modulId: string, api: string) => {
    try {
      const res = await onConfirmAction.default({modulId, api})

      if (res) {
        
        console.log(modulId, tables, res.success);
          
        const updatedTables = tables.filter((table) => table.tahun_ajaran_id !== modulId);
        setTables(updatedTables);
  
        toast.success(res.message ?? 'Modul berhasil di hapus', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }


    } catch (error) {
      console.error('An error occurred while deleting the modul', error);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {OpenButton ?? (<div>Open</div>)}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak bisa di batalkan . Ini akan menghapus modul terkait
            dan akan menghapus data dari servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(modulId, api)}>Lanjutkan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TableDelete