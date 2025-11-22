"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import dokumenModalForm, { dokumenFormSchema } from "@/components/tables/modal/dokumenModalForm";
import layananModalForm, { layananFormSchema } from "@/components/tables/modal/layananModalForm";
import Tables from "@/components/tables/Tables";
import TablesAdd from "@/components/tables/TablesAdd";
import TableDelete from "@/components/tables/TablesDelete";
import TablesEdit from "@/components/tables/TablesEdit";
import TablesSwitch from "@/components/tables/TablesSwitch";
import Button from "@/components/ui/button/Button";

import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { TableCell } from "@/components/ui/table";
import { layanan } from "@/generated/prisma";
import { TrashBinIcon } from "@/icons";
import { useTablesStore } from "@/store/useTablesStore";

import listDataType from "@/types/listDataTable";
import dokumenType from "@/types/model/dokumen";
import fakultasType from "@/types/model/fakultas";
import layananType from "@/types/model/layanan";
import modulType from "@/types/model/modul";
import { zodResolver } from "@hookform/resolvers/zod";
import { Collapsible } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronsDown, ChevronsUpDown, NotebookText, PencilIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { use, useEffect } from "react";


const api = "/api/layanan";
const apiDokumen = "/api/dokumen"

const table: {
  api: string,
  listData: listDataType<layananType>[]
} = {
  api,
  listData: [
    {
      name: "Jenis Layanan",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.layanan_jenis || "-"}
        </TableCell>
      )
    },
    {
      name: "Petugas Layanan",
      component: ({ table }) => (
        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
          {table.layanan_lvl || "-"}
        </TableCell>
      )
    },

    {
      name: "Dokumen Syarat",
      component: ({ table }) => {
        const [isOpen, setIsOpen] = React.useState(false)

        const { tables, setTables } = useTablesStore(state => state);

        return (
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="flex w-[350px] flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-4 px-4">
                {/* <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4> */}
                <div></div>
                {
                  table.dokumens?.length > 1 && (
                    <CollapsibleTrigger asChild>
                      <button className="size-8">
                        {isOpen ? <ChevronDown /> : <ChevronsUpDown />}
                        <span className="sr-only">Toggle</span>
                      </button>
                    </CollapsibleTrigger>
                  )
                }

              </div>
              {
                table.dokumens?.length > 0 && (<div className="rounded-md border px-4 py-2 font-mono text-sm flex justify-between">
                  <div>
                    {table.dokumens[0].dokumen_name} <br /> Maksimal Size {table.dokumens[0].dokumen_size} MB<br /> Tipe File {table.dokumens[0].dokumen_type}
                  </div>

                  <div>
                    <TablesEdit
                      api={apiDokumen}
                      IconButton={(
                        <p className="cursor-pointer text-green-500 underline">Edit</p>
                      )}
                      data={table.dokumens[0]}
                      formData={dokumenModalForm}
                      formSchema={dokumenFormSchema}
                      resolver={zodResolver(dokumenFormSchema)}
                      id={table.dokumens[0].dokumen_id}
                      idLabel="dokumen_id"
                      refreshState={(data) => {
                        setTables(tables.map(tab => ({
                        ...tab,
                        dokumens: tab.dokumens.map((dokumen: dokumenType) => dokumen.dokumen_id === table.dokumens[0].dokumen_id ? {
                          ...dokumen,
                          ...data
                        } : dokumen)
                      })))
                      }}
                    />
                    <TableDelete refreshState={() => {
                      setTables(tables.map(tab => ({
                        ...tab,
                        dokumens: tab.dokumens.filter((dokumen: dokumenType) => dokumen.dokumen_id != table.dokumens[0].dokumen_id)
                      })))
                    }} api={apiDokumen} modulId={table.dokumens[0].dokumen_id} OpenButton={
                      <p className="cursor-pointer text-red-500 underline">Delete</p>} />
                  </div>
                </div>)
              }



              <CollapsibleContent className="flex flex-col gap-2">
                {
                  table.dokumens?.slice(1).map(val => (
                    <div key={val.dokumen_id} className="rounded-md border px-4 py-2 font-mono text-sm flex justify-between">
                      <div>

                        {val.dokumen_name}
                        <br /> Maksimal Size {val.dokumen_size} MB<br /> Tipe File {val.dokumen_type}
                      </div>
                      <div>
                        <TablesEdit
                          api={apiDokumen}
                          IconButton={(
                            <p className="cursor-pointer text-green-500 underline">Edit</p>
                          )}
                          data={val}
                          formData={dokumenModalForm}
                          formSchema={dokumenFormSchema}
                          resolver={zodResolver(dokumenFormSchema)}
                          id={val.dokumen_id}
                          idLabel="dokumen_id"
                          refreshState={(data) => {
                        setTables(tables.map(tab => ({
                        ...tab,
                        dokumens: tab.dokumens.map((dokumen: dokumenType) => dokumen.dokumen_id === val.dokumen_id ? {
                          ...dokumen,
                          ...data
                        } : dokumen)
                      })))
                      }}
                        />

                        <TableDelete 
                          refreshState={() => {
                            setTables(tables.map(tab => ({
                              ...tab,
                              dokumens: tab.dokumens.filter((dokumen: dokumenType) => dokumen.dokumen_id != val.dokumen_id)
                            })))
                          }}
                        api={apiDokumen} modulId={val.dokumen_id} OpenButton={
                          <p className="cursor-pointer text-red-500 underline">Delete</p>
                        } />
                      </div>
                    </div>
                  ))
                }

              </CollapsibleContent>
            </Collapsible>
          </TableCell>
        )
      }
    },
    {
      name: "Aksi",
      component: ({ table }) => { 

        const { tables, setTables } = useTablesStore(state => state);                
        
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
            formData={layananModalForm}
            formSchema={layananFormSchema}
            resolver={zodResolver(layananFormSchema)}
            id={table.layanan_id}
            idLabel="layanan_id"
          />


          <TableDelete api={api} OpenButton={
            (<Button size="sm" variant="primary"
              className="bg-red-500"
            >
              <TrashBinIcon />
            </Button>)
          }
            modulId={table.layanan_id}
            idLabel="layanan_id"
          />
          <TablesAdd IconButton={(
            <Button size="sm" variant="primary"
              className="bg-brand-500"
            >
              <NotebookText />
            </Button>
          )}

          refreshState={
            (data) => {
                setTables(tables.map(tab => table.layanan_id == tab.layanan_id ? ({
                    ...tab,
                    dokumens: [...tab.dokumens, data]
                  }) : tab))
            }
          }

            formData={dokumenModalForm}
            formSchema={dokumenFormSchema}
            resolver={zodResolver(dokumenFormSchema)}
            api={`${apiDokumen}?layanan_id=${table.layanan_id}`}

          />
        </TableCell>
      )}
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
      
      <PageBreadcrumb pageTitle="Pengaturan Layanan Akademik" />
      <div className="space-y-6">
        <ComponentCard api={table.api} add={
          {
            api: table.api,
            formData: layananModalForm,
            formSchema: layananFormSchema,
            resolver: zodResolver(layananFormSchema)
          }
        } >
          <Tables listData={table.listData} api={table.api} />
        </ComponentCard>
      </div>
    </div>
  );
}
