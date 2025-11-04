"use server";

import { revalidateTag } from "next/cache";
import { toast } from "react-toastify";

interface onConfirmProps {
  api: string;
  modulId: string;
}


export default async function onConfirm({ modulId, api }: onConfirmProps) {
  
  try {

    console.log(`${process.env.NEXT_AUTH_URL}${api}/${modulId}`);
    
    const res = await fetch(`${process.env.NEXT_AUTH_URL}${api}/${modulId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      const resJson = await res.json();      
            
      return resJson;
    } else {
      throw new Error('Gagal untuk menghapus data');
    }
  } catch (error) {
    console.log(error);
  }

}