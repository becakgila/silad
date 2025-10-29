"use client";
import React from "react";
import { TableCell } from "@/components/ui/table";
import Switch from "@/components/form/switch/Switch";

interface ModulsSwitchProps {
  defaultChecked?: boolean;
  modulId?: string | number;
  field: "modul_aktif" | "modul_newtab";  // The field to update in the PATCH request
}

const ModulsSwitch: React.FC<ModulsSwitchProps> = ({ defaultChecked = false, modulId, field }) => {
  const handleChange = (checked: boolean) => {
    
    if (!modulId) {
      
      console.log("ModulsSwitch toggled", checked);
      return;
    }

    // Best-effort update — errors are logged but don't break UI.
    fetch(`/api/component/modules/${modulId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: checked ? "yes" : "no" }),
    }).catch((err) => console.error("Failed to update module state", err));
  };

  return (
    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
      <Switch label="" defaultChecked={defaultChecked} onChangee={handleChange} />
    </TableCell>
  );
};

export default ModulsSwitch;
