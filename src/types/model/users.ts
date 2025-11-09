export default interface userType {
  id: string,
  name: string,
  nips: string,
  email: string,
  phone: string,
  level: string,
  fakultas_id: string,
  fakultas: {
    fakultas_id: string,
    fakultas_name: string,
  },
  prodi: {
    prodi_id: string,
    prodi_name: string,
  },
  prodi_id: string,
  status: string,
  email_verified_at: string,
  password: string,
  remember_token: string,
  created_at: string,
  updated_at: string,
}