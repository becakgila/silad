import layananType from "./layanan"
import mahasiswaType from "./mahasiswa"
import tahunajaranType from "./tahunajaran"

export default interface ajuanType {
  ajuan_id: string,
  nim: string,
  tahun_ajaran: tahunajaranType,
  status: string,
  layanan: layananType,
  mahasiswa: mahasiswaType
}