import { toast } from "react-toastify";

export default async function onConfirm(modulId: string) {
  
  try {
    const res = await fetch(`/api/component/modules/${modulId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      const resJson = await res.json();
      toast.success(resJson.message ?? 'Modul berhasil di hapus', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    } else {
      throw new Error('Gagal untuk menghapus modul');
    }
  } catch (error) {
    console.log(error);
  }

}