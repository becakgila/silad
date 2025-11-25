"use client"
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { uploadFile } from "./action";
import { toast } from "react-toastify";
import { email, set } from "zod";
import Select from "@/components/form/Select";
import { ChevronDownIcon, Target } from "lucide-react";
import layananType from "@/types/model/layanan";
import dokumenType from "@/types/model/dokumen";



export default function Page() {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    id: string;
  }[]>([]);
  const [layananId, setLayananId] = useState<any>(null);
  const [errorList, setErrorList] = useState<any[]>([]);
  const [layanan, setLayanan] = useState<layananType[]>([]);
  const [dok, setDok] = useState<dokumenType[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = event.target.files?.[0];

    console.log(file);

    // setErrorList([]);
    if (file) {

      if (selectedFile.filter(data => data.id === id).length != 0) {
        setSelectedFile(selectedFile.map(data => data.id === id ? {
          file,
          id
        } : data));
      } else {
        setSelectedFile([...selectedFile, { file, id }])
      }

      console.log("File dipilih:", file.name);
    }
  };

  async function handleSubmit() {


    try {
      const formData = new FormData();

      selectedFile.forEach((v) => {
        formData.append(`files`, v.file)
        formData.append(`id_document`, v.id)
      })

      formData.append('ajuan_id', layananId)

      console.log(formData.getAll('files'), 'ini files');

      const response = await fetch(`/api/ajuanDok`, {
        method: 'POST',
        body: formData,
      });

    } catch {

    }

  }

  async function getAjuan() {
    const res = await fetch('/api/layanan');
    const data = await res.json();    

    setLayanan(data.data);
  }

  async function getDokumen(id: string) {
    const res = await fetch('/api/dokumen?ajuan_id=' + id);
    const data = await res.json();    
    setDok(data.data);
    // setLayanan(data.data);
  }

  useEffect(() => {
    getAjuan();
  }, []);  

  return (
    <div>
      <PageBreadcrumb pageTitle="Upload Mahasiswa" />
      <div className="min-h-screen p-8">
        <form action={() => handleSubmit()} >
          <h1 className="text-2xl font-bold mb-4">Upload File</h1>
          <div className="relative">
            <Select onChange={(idAjuan) => {
              
              getDokumen(idAjuan);
              setLayananId(idAjuan)
              setSelectedFile([])

            }}
              //   options={
              //     [
              //     { value: 'administrator', label: 'Administrator' },
              //     { value: 'fakultas', label: 'Fakultas' },
              //     { value: 'prodi', label: 'Prodi' },
              //   ]
              // }
              options={layanan.map((val, id) => ({
                value: val.layanan_id,
                label: val.layanan_jenis
              }))}
              // {...field}
              // defaultValue={field.value}
              // onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>

          {
            dok.map((val, id) => (
              <div key={val.dokumen_id}>
                <h1 className="text-2xl font-bold mb-4">Upload File {val.dokumen_name}</h1>
                <FileInput accept=".pdf" className="mb-4" onChange={(e) => handleFileChange(e, val.dokumen_id)} />
                {selectedFile[id] && (
                  <p className="text-green-600">File terpilih: {selectedFile[id].file.name}</p>
                )}
              </div>
            ))
          }

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
