export default interface prodiType {
  prodi_id: string,
  prodi_name: string,
  prodi_jenjang: string,
  prodi_akreditasi: string,
  fakultas: {
    fakultas_id: string,
    fakultas_name: string,
  },
}