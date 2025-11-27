import fakultasType from "./fakultas";
import prodiType from "./prodi";

export default interface userType {
  id: string,
  name: string,
  nips: string,
  email: string,
  phone: string,
  level: string,
  fakultas_id: string,
  fakultas: fakultasType,
  prodi: prodiType,
  prodi_id: string,
  status: string,
  email_verified_at: string,
  password: string,
  remember_token: string,
  created_at: string,
  updated_at: string,
}