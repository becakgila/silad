import React from "react";
import {
  Table,  
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import ModulsBody from "./ModulsBody";
import BodyTable from "./BodyTable";

interface ModulsTablesProps {
  headers: string[];
}



export default function HeaderTable({ headers }: ModulsTablesProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {
                  headers.map((header, index) => (
                    <TableCell key={header}
                  isHeader                
                  className="px-5 py-3 w-10 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >{header}</TableCell>
                  ))
              }
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <BodyTable />
          </Table>
        </div>
      </div>
    </div>
  );
}
