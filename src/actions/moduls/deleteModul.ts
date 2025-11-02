"use server";

import { revalidateTag } from "next/cache";
import { toast } from "react-toastify";

export default async function onConfirm(modulId: string) {
  
  try {
    const res = await fetch(`${process.env.NEXT_AUTH_URL}/api/component/modules/${modulId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      const resJson = await res.json();      
      
      revalidateTag('moduls-data');
      return resJson;
    } else {
      throw new Error('Gagal untuk menghapus modul');
    }
  } catch (error) {
    console.log(error);
  }

}