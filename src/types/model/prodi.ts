export default interface prodiType {
  prodi_id: string,
  prodi_name: string,
  prodi_jenjang: string,
  prodi_akreditasi: string,
  fakultas_id: string,
  created_at: string,
  updated_at: string,

  fakultas: {
    fakultas_id: string,
    fakultas_name: string,
  },
}