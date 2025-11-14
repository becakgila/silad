import React, { use } from "react";
import {
  Table as TableUi,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import TablesBody from "./TablesBody";
import listDataType from "@/types/listDataTable";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import { useTablesStore } from "@/store/useTablesStore";
import { set } from "zod";

interface UserTableProps {
  api: string,
  listData: listDataType[],
}

export default function Tables({ api, listData }: UserTableProps) {

  const {setTablesSort, tablesSort} = useTablesStore(state => state);

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
                  listData.map((data: any) => (

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      key={data.name}
                    >
                      <div className="flex items-center justify-between">

                        <p>
                          {data.name}
                        </p>

                        {
                          data.tableName &&
                          <button onClick={() => {

                            if(data.tableName === tablesSort?.column){

                              setTablesSort(
                                tablesSort?.direction === 'desc' ? null :  {column : data.tableName, direction: tablesSort?.direction === 'asc' ? 'desc' : 'asc'} );
                                return;
                            }

                            setTablesSort({column : data.tableName, direction: 'asc'});
                            

                          }}>
                            {
                              tablesSort?.column === data.tableName ? (tablesSort?.direction === 'asc' ?
                                <ChevronDown size={10} strokeWidth={2} /> :
                              <ChevronUp size={10} strokeWidth={2} /> 
                                 ) : (<>
                                <ChevronUp size={10} strokeWidth={2} /> 
                              <ChevronDown size={10} strokeWidth={2} /> 
                              </> )
                              
                            }
                          </button>
                        }
                      </div>
                    </TableCell>
                  ))
                }

              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TablesBody api={api} listData={listData} />
          </TableUi>
        </div>
      </div>
    </div>
  );
}
