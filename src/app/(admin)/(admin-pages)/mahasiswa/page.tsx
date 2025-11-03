import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import HeaderTable from "@/components/tables/moduls/HeaderTable";
import React from "react";

const headers = ['No', 'Nama Moduls', 'Url', 'Icon', 'Hak Akses', 'Aktif', 'New Tab', 'Aksi'];

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Mahasiswa" />
      <div className="space-y-6">
        <ComponentCard title="Mahasiswa List" >
          <HeaderTable headers={headers} />
        </ComponentCard>
      </div>
    </div>
  );
}
