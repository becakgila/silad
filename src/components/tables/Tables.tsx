import React from "react";
import {
  Table as TableUi,  
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import UsersBody from "./TablesBody";
import listDataType from "@/types/listDataTable";

interface UserTableProps {  
  api: string,
  listData: listDataType[]
}

export default function Tables ({ api, listData} : UserTableProps)  {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <TableUi>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                    isHeader                
                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    
                  >
                    No
                  </TableCell>

                {
                  listData.map((data : any) => (

                  <TableCell
                    isHeader                
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    key={data.name}
                  >
                    {data.name}
                  </TableCell>
                  ))
                }
                
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <UsersBody api={api} listData={listData} />
          </TableUi>
        </div>
      </div>
    </div>
  );
}
