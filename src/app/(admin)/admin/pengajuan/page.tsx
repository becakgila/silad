"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PengajuanUpload from "@/components/tables/pengajuan/ButtonPengajuanUpload";
import prodiModalForm, { prodiFormSchema } from "@/components/tables/modal/prodiModalForm";
import ButtonPengajuanPreview from "@/components/tables/pengajuan/ButtonPengajuanPreview";
import Tables from "@/components/tables/Tables";
import TableDelete from "@/components/tables/TablesDelete";
import TablesEdit from "@/components/tables/TablesEdit";
import TablesSwitch from "@/components/tables/TablesSwitch";
import Button from "@/components/ui/button/Button";

import { TableCell } from "@/components/ui/table";
import { TrashBinIcon } from "@/icons";
import { useTablesStore } from "@/store/useTablesStore";

import listDataType from "@/types/listDataTable";
import ajuanType from "@/types/model/ajuan";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileSearch, PencilIcon, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import userType from "@/types/model/users";
import ajuanStatusType from "@/types/model/ajuanStatus";
import { toast } from "react-toastify";
import progressNumber from "@/variable/progressNumber";


const api = "/api/pengajuan";

const table: {
  api: string,
  listData: listDataType<ajuanType>[]
} = {
  api,
  listData: [
    {
      name: "Tahun Ajaran",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.tahun_ajaran.tahun_awal + "/" + table.tahun_ajaran.tahun_akhir + " " + table.tahun_ajaran.semester || "-"}
        </TableCell>
      )
    },
    {
      name: "Nim",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.nim || "-"}
        </TableCell>
      )
    },
    {
      name: "Nama",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.mahasiswa.nama || "-"}
        </TableCell>
      )
    },
    {
      name: "Prodi",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.mahasiswa.prodi.prodi_name || "-"}
        </TableCell>
      )
    },
    {
      name: "Layanan",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.layanan.layanan_jenis || "-"}
        </TableCell>
      )
    },
    {
      name: "Progress",
      component: ({ table }) => {
        const [progress, setProgressState] = useState("prodi");        
        
        async function fetchStatus() {

          try {            
            
            const fetchData = await fetch(`/api/ajuanStatus?ajuan_id=${table.ajuan_id}`)

            if (fetchData.ok) {
              const data = await fetchData.json();              

              if (data.data.length !== 0) {
                const progress = (data.data.at(-1) as ajuanStatusType).progress;                                                
                
                setProgressState(progress === 1 ? 'fakultas' : progress === 2 ? 'administrator' : 'selesai')                
              }
            }

          } catch (error) {
              console.log(error);
              
          }
        }

        useEffect(() => {                  
          fetchStatus()
        }, [])

        return (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {progress || "-"}
        </TableCell>
      )}
    },
    {
      name: "Status",
      component: ({ table }) => {        
        
        return (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.status || "-"}
        </TableCell>
      )}
    },
    {
      name: "Preview",
      component: ({ table }) => {


        return (<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">          
          <ButtonPengajuanPreview
            id={table.layanan.layanan_id}
            IconButton={
              (
                <Button size="sm" variant="primary"
                  className="bg-brand-500"
                >
                  <FileSearch />
                </Button>
              )
            }
          />
        </TableCell>)

      }
    }
    ,
    {
      name: "Aksi",
      component: ({ table }) => {
        const { data: session, status } = useSession()
        const [progress, setProgressState] = useState("prodi");
        const [user, setUserState] = useState<userType>()
        const [uploadView, setUploadView] = useState<boolean>(false)        

        async function fetchUser() {          

          try {
            const user = session?.user;
            const fetchData = await fetch(`/api/users/${user?.id}`);
            const data = await fetchData.json();            
            
            setUserState(data.data)
          } catch (error) {

            const err = error as Error;

            toast.error(`gagal fetch data user!!! ${err.message}`,)
          }
        }

        async function fetchStatus() {

          try {            
            
            const fetchData = await fetch(`/api/ajuanStatus?ajuan_id=${table.ajuan_id}`)

            if (fetchData.ok) {
              const data = await fetchData.json();              

              if (data.data.length !== 0) {
                const progress = (data.data.at(-1) as ajuanStatusType).progress;                                                
                
                setProgressState(progress === 1 ? 'fakultas' : progress === 2 ? 'administrator' : 'selesai')                
              }
            }

          } catch (error) {
              console.log(error);
              
          }
        }



        useEffect(() => {
          if (status !== "authenticated") return

          fetchUser()
          fetchStatus()
        }, [status])

        useEffect(() => {
          
          const layanan_lvl = progressNumber[table.layanan.layanan_lvl]
          const progress_lvl = progressNumber[progress]                              

          console.log(progress,'ini progress');
          if( (layanan_lvl < progress_lvl) || user?.level.toLowerCase() !== progress){
            setUploadView(false)
            return
          }          
          
          if(progress === "prodi") {
            setUploadView(user?.prodi_id === table.mahasiswa.prodi_id)
          }

          if (progress === "fakultas") {
            setUploadView(user?.fakultas_id === table.mahasiswa.prodi.fakultas_id)
          }
          
        }, [user, progress])

        return (
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 gap-1.5 flex">
            <TablesEdit
              api={api}
              IconButton={(
                <Button size="sm" variant="primary"
                  className="bg-green-600"
                >
                  <PencilIcon />
                </Button>
              )}
              data={table}
              formData={prodiModalForm}
              formSchema={prodiFormSchema}
              resolver={zodResolver(prodiFormSchema)}
              id={table.ajuan_id}
              idLabel="ajuan_id"
            />

            <TableDelete api={api} OpenButton={
              (<Button size="sm" variant="primary"
                className="bg-red-500"
              >
                <TrashBinIcon />
              </Button>)
            }
              modulId={table.ajuan_id}
              idLabel="ajuan_id"
            />
            {
              
              // user?.level.toLowerCase() === progress && user?.prodi_id === table.mahasiswa.prodi_id && (
              uploadView && (
                <PengajuanUpload
                  id={table.ajuan_id}
                  idLayanan={table.layanan.layanan_id}
                  onSubmitFinish={(progress) => {                    
                    
                    const progressText : string = (Object.keys(progressNumber).find(k => progressNumber[k] === (progress+1)) as string)

                    // console.log(progressText, 'ini progress text');                    

                    setProgressState(progressText)
                  }}
                  progress={progressNumber[progress]}
                  IconButton={
                    (
                      <Button size="sm" variant="primary"
                        className="bg-brand-500"
                      >
                        <Upload />
                      </Button>
                    )
                  }
                />
              )
            }
          </TableCell>
        )
      }
    },
  ]
}

export default function BasicTables() {


  const setTableDefault = useTablesStore(state => state.setTablesDefault);
  const setLastPath = useTablesStore(state => state.setLastPath);
  const pathname = usePathname();

  useEffect(() => {
    setTableDefault();
    setLastPath(pathname);
  }, [pathname]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Riwayat Pengajuan Layanan Akademik" />
      <div className="space-y-6">
        <ComponentCard api={table.api} >
          <Tables listData={table.listData} api={table.api} />
        </ComponentCard>
      </div>
    </div>
  );
}
