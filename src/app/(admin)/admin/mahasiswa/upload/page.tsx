"use client"
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { uploadFile } from "./action";
import { toast } from "react-toastify";
import { email, set } from "zod";



export default function PageKosong() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [errorList, setErrorList] = useState<any[]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setErrorList([]);
      if (file) {
        setSelectedFile(file);
        console.log("File dipilih:", file.name);
      }
    };
    async function handleSubmit(selectedFile: File | null) {
      const res = await uploadFile(selectedFile).finally(() => {
        setSelectedFile(null) 
      });

      res.data?.map((v, i) => {
        
        const res =fetch('/api/mahasiswa', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nim: v.NIM,
            nama: v.NAMA,
            nik: v.NIK,
            email: v.EMAIL,
            jenis_kelamin: v["JENIS KELAMIN"],
            alamat: v.ALAMAT,
            no_hp: v["NO TELEPON"],
            kota: v.KOTA,
            provinsi: v.PROVINSI,
            kecamatan: v.KECAMATAN,
            agama: v.AGAMA,
            angkatan: v.ANGKATAN,
            jalur_masuk: v["JALUR MASUK"],
            tempat_lahir: v["TEMPAT LAHIR"],
            tanggal_lahir: new Date(v["TANGGAL LAHIR"]),
            prodi_id: v["PRODI ID"].toString(),
          }),
        }).then((response) => {
          if (!response.ok) {
            const data = response.json().then((data) => {
              setErrorList((prev) => [...prev, {row: i + 2, issue: data}])
              });
            
          }

        })
      }


      );

      if (res.success){
        console.log(res, "log selesai");
        
      }
      res.error ? toast.error(res.error): toast.success(res.message);

    }



  return (
    <div>
      <PageBreadcrumb pageTitle="Upload Mahasiswa" />
      <div className="min-h-screen p-8">
        <form action={()=> handleSubmit(selectedFile)} >
          <h1 className="text-2xl font-bold mb-4">Upload File</h1>
          <FileInput className="mb-4" onChange={handleFileChange} />
          {selectedFile && (
            <p className="text-green-600">File terpilih: {selectedFile.name}</p>
          )}
          <Button type="submit" size="sm" variant="primary">
                      Upload <PlusIcon />
                    </Button>
        
        </form>

        {
          errorList.map((error, index) => (
            <div key={index} className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded">
              Baris {error.row}: {error.message} : {JSON.stringify(error.issue)}
            </div>
          ))
        }

      </div>
    </div>


  );
}
