"use client"
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { uploadFile } from "./action";
import { toast } from "react-toastify";



export default function PageKosong() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        console.log("File dipilih:", file.name);
      }
    };
    async function handleSubmit(selectedFile: File | null) {
      const res = await uploadFile(selectedFile).finally(() => {
        setSelectedFile(null) 
      });
      // if (res.status === 200) {
      //   toast.success("Modul berhasil diupdate.")
      //   const res = await response.json();
      // }
      // setResult(res);
      console.log(res);
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

      </div>
    </div>


  );
}
