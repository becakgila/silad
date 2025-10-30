"use client"

import onConfirm from "@/actions/moduls/deleteModul";
import { AlertDialogFooter, AlertDialogHeader, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger  } from "@/components/ui/alert-dialog"
import React from "react";

type Props = {
  OpenButton? : React.JSX.Element;
  modulId: string;
}


const ModulsDelete = ({OpenButton, modulId}: Props) => {
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
          <AlertDialogAction onClick={()=> onConfirm(modulId)}>Lanjutkan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ModulsDelete