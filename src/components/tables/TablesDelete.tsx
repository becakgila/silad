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
  idLabel?: string;
  refreshState?: () => void;
}


const TableDelete = ({ OpenButton, modulId, api, idLabel="id", refreshState }: Props) => {

  const setTables = useTablesStore((state) => state.setTables)
  const tables = useTablesStore((state) => state.tables)

  const onConfirm = async (modulId: string, api: string) => {
    try {
      const res = await onConfirmAction.default({modulId, api})

      if (res) {                

        if(refreshState){
          refreshState()
        }else{
          
          const updatedTables = tables.filter((table) => table[idLabel] !== modulId);
          setTables(updatedTables);
        }
          
  
        toast.success(res.message ?? 'Data berhasil di hapus', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }


    } catch (error) {
      console.error('An error occurred while deleting the Data', error);
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
            Aksi ini tidak bisa di batalkan . Ini akan menghapus data terkait
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