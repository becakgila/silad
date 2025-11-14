import type { FC } from "react";

// Make the list data descriptor generic so callers can pass User, Modul, etc.
export default interface listDataType<T = any> {
  name: string;
  tableName?: string;
  component: FC<{
    table: T;
  }>;
}