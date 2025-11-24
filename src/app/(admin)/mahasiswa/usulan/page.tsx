"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LayananUpload from "@/components/tables/layanan/ButtonLayanan";
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
import React, { use, useEffect } from "react";
import { UserPlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


const api = "/api/usulan";

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
      name: "Status",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.status || "-"}
        </TableCell>
      )
    },
    {
      name: "Preview",
      component: ({ table }) => {

        return (<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">

          {/* <p>test</p> */}
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
        // const { data: session } = useSession();
        // async function fetchUser() {
        //   const fetchData = await fetch(`/api/mahasiswa/${session?.user.id}`);
        //   const data = await fetchData.json()
        // }
        // useEffect(() => {
        //   fetchUser()
        // }, [])

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

            <LayananUpload
              id={table.layanan.layanan_id}
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
  const route = useRouter();

  useEffect(() => {
    setTableDefault();
    setLastPath(pathname);
  }, [pathname]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Riwayat Pengajuan Layanan Akademik" />
      <div className="space-y-6">
        <ComponentCard api={table.api} ButtonProp={
          <Button onClick={() => route.push("/mahasiswa/usulan/tambah")} size="sm" variant="primary"
            >
            TAMBAH <UserPlusIcon />
          </Button>
        }>
          <Tables listData={table.listData} api={table.api} />
        </ComponentCard>
      </div>
    </div>
  );
}
