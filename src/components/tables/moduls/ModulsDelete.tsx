"use client"

import * as onConfirmAction from "@/actions/moduls/deleteModul";
import { AlertDialogFooter, AlertDialogHeader, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

type Props = {
  OpenButton?: React.JSX.Element;
  modulId: string;
}


const ModulsDelete = ({ OpenButton, modulId }: Props) => {

  const onConfirm = async (modulId: string) => {
    try {
      const res = await onConfirmAction.default(modulId)

      toast.success(res.message ?? 'Modul berhasil di hapus', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });

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
          <AlertDialogAction onClick={() => onConfirm(modulId)}>Lanjutkan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ModulsDelete