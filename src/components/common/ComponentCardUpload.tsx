
import React from "react";
import TablesSearch from "../tables/TablesSearch";
import TablesPagination from "../tables/TablesPagination";
import { useTablesStore } from "@/store/useTablesStore";
import Button from "../ui/button/Button";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import TablesAdd from "../tables/TablesAdd";
import modulModalForm, { modulFormSchema } from "../tables/modal/modulModalForm";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Resolver, UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";

// Extract store selectors
const useTablesPaginationState = () => {
  const page = useTablesStore(state => state.tablesPage);
  const setPage = useTablesStore(state => state.setTablesPage);
  const total = useTablesStore(state => state.tablesTotal);
  const take = useTablesStore(state => state.tablesTake);
  const setTake = useTablesStore(state => state.setTablesTake);

  return { page, setPage, total, take, setTake };
};





interface ComponentCardUploadProps {
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  api: string; // Description text
  add?: {
    api: string,
    formSchema: z.ZodSchema<any>;
    resolver: Resolver<any, any, any> | undefined;
    formData: React.FC<{ form: UseFormReturn<any, any, any> }>[];
  }
}

const ComponentCardUpload: React.FC<ComponentCardUploadProps> = ({
  children,
  className = "",
  desc = "",
  add,
}) => {
  // Get pagination state from store
  const paginationState = useTablesPaginationState();
  const router = useRouter();

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {add &&
              <TablesAdd
                formData={add.formData}
                formSchema={add.formSchema}
                resolver={add.resolver}
                IconButton={
                  <Button size="sm" variant="primary">
                    TAMBAH <PlusIcon />
                  </Button>
                }
                api={add.api}
              />
            }
            <Button onClick={()=>router.push("/admin/mahasiswa/upload")} size="sm" variant="primary"
                                className="bg-blue-light-950">
                                Upload <UserPlusIcon />
                              </Button>
          </h3>
          <div className="flex gap-3.5 items-center">
            <TablesSearch />
          </div>
        </div>
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>

      <TablesPagination {...paginationState} />

    </div>
  );
};

export default ComponentCardUpload;
