
import React from "react";
import TablesSearch from "../tables/TablesSearch";
import TablesPagination from "../tables/TablesPagination";
import { useTablesStore } from "@/store/useTablesStore";

// Extract store selectors
const useTablesPaginationState = () => {
  const page = useTablesStore(state => state.tablesPage);
  const setPage = useTablesStore(state => state.setTablesPage);
  const total = useTablesStore(state => state.tablesTotal);
  const take = useTablesStore(state => state.tablesTake);
  const setTake = useTablesStore(state => state.setTablesTake);
  
  return { page, setPage, total, take, setTake };
};





interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  api: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  api
}) => {
  // Get pagination state from store
  const paginationState = useTablesPaginationState();

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex justify-between items-center">

          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>


          <TablesSearch />

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

export default ComponentCard;
