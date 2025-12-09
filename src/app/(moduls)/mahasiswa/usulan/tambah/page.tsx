"use client"
import React, { use, useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { uploadFile } from "./action";
import { toast } from "react-toastify";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "lucide-react";
import layananType from "@/types/model/layanan";
import dokumenType from "@/types/model/dokumen";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { set } from "zod";

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    id: string;
  }[]>([]);
  const [ajuanId, setAjuanId] = useState<any>(null);
  const [errorList, setErrorList] = useState<any[]>([]);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});
  const [layanan, setLayanan] = useState<layananType[]>([]);
  const [dok, setDok] = useState<dokumenType[]>([]);
  const session = useSession();

  const route = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile((prev) => {
      const exists = prev.some((p) => p.id === id);
      if (exists) {
        return prev.map((p) => (p.id === id ? { file, id } : p));
      } else {
        return [...prev, { file, id }];
      }
    });

    // Clear validation error on that field when user picks a file
    setInputErrors((prev) => {
      if (!prev[id]) return prev;
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate required documents
    const errors: Record<string, string> = {};
    dok.forEach((d) => {
      if (!d.optional) {
        const found = selectedFile.find((s) => s.id === d.dokumen_id);
        if (!found) {
          errors[d.dokumen_id] = `${d.dokumen_name} wajib diisi`;
        }
      }
    });

    if (Object.keys(errors).length) {
      setInputErrors(errors);
      return;
    }

    // Proceed with submit if no validation errors
    try {
      const formData = new FormData();

      selectedFile.forEach((v) => {
        formData.append(`files`, v.file);
        formData.append(`id_document`, v.id);
      });

      formData.append("ajuan_id", ajuanId);

      const response = await fetch(`/api/ajuanDok`, {
        method: "POST",
        body: formData,
      });

      if(response.ok){
        route.push("/mahasiswa/usulan")
      }

      // handle response as needed
    } catch (err) {
      
      console.log(err);      

    }
  }

  async function getAjuan() {
    const res = await fetch("/api/layanan");
    const data = await res.json();

    setLayanan(data.data);
  }

  async function getDokumen(id: string) {
    const res = await fetch("/api/dokumen?layanan_id=" + id);
    const data = await res.json();
    setDok(data.data);
    // clear validation and files when switching services
    setSelectedFile([]);
    setInputErrors({});
  }

  async function getAjuanId(id: string){
    const idMahasiswa = session.data?.user?.id;
    // console.log(id, session);
    
    const res = await fetch(`/api/pengajuan?layanan_id=${id}&mahasiswa_id=${idMahasiswa}`);
    const dataJson = await res.json();
    console.log(dataJson);

    setAjuanId(dataJson.data?.ajuan_id);
    
  }

  useEffect(() => {
    getAjuan();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Pengajuan Mahasiswa" />
      <div className="min-h-screen p-8 ">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-4">Upload File: </h1>
            <div className="relative">
              <Select
                onChange={(idLayanan) => {
                  getDokumen(idLayanan);
                  getAjuanId(idLayanan)
                  // setAjuanId(idAjuan);
                  setSelectedFile([]);
                  setInputErrors({});
                }}
                options={layanan.map((val) => ({
                  value: val.layanan_id,
                  label: val.layanan_jenis,
                }))}
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {dok.map((val) => {
            const sel = selectedFile.find((s) => s.id === val.dokumen_id);
            return (
              <div key={val.dokumen_id}>
                <h1 className="text-2xl font-bold mb-4">
                  Upload File {val.dokumen_name} {!val.optional && <span className="mt-2 text-s text-red-600"> (* Wajib)</span>}
                </h1>
                <FileInput
                  accept=".pdf"
                  className="mb-4"
                  onChange={(e) => handleFileChange(e, val.dokumen_id)}
                  required={!val.optional}
                />
                {sel && <p className="text-green-600">File terpilih: {sel.file.name}</p>}
                {inputErrors[val.dokumen_id] && (
                  <p className="mt-2 text-sm text-red-600">{inputErrors[val.dokumen_id]}</p>
                )}
              </div>
            );
          })}

          <Button type="submit" size="sm" variant="primary">
            Submit <PlusIcon />
          </Button>
        </form>

        {errorList.map((error, index) => (
          <div key={index} className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded">
            Baris {error.row}: {error.message} : {JSON.stringify(error.issue)}
          </div>
        ))}
      </div>
    </div>
  );
}