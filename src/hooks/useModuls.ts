"use client"

import Modul from "@/type/model/modul";
import { useCallback, useState } from "react";


export const useModuls = () => {
  const [moduls, setModuls] = useState<Modul[]>([]);

  const setModulsById = useCallback((modulId: number, updatedModul: Partial<Modul>) => {
    setModuls((prevModuls) =>
      prevModuls.map((modul) =>
        modul.modul_id === String(modulId) ? { ...modul, ...updatedModul } : modul
      )
    );
  }, []);

  
  return {moduls, setModulsById, setModuls};
}