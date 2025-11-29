import layananType from "./layanan"
import mahasiswaType from "./mahasiswa"

export default interface ajuanType {
  ajuan_id: string,
  nim: string,
  tahun_ajaran:{
      tahun_ajaran_id: string,
      tahun_awal:      string,
      tahun_akhir:     string,
      semester:     string,
  },
  status: string,
  layanan: layananType,
  mahasiswa: mahasiswaType
}