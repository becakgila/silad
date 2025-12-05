import dosenType from "./dosen";

export default interface fakultasType {
  fakultas_id: string;
  fakultas_name:string;
  fakultas_dekan:string;
  created_at?: Date;
  updated_at?: Date;  

  dosen:dosenType
}