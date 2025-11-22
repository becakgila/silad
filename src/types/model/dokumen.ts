import ajuanDokType from "./ajuanDok";

export default interface dokumenType {
  dokumen_id: string;
  dokumen_name: string;
  dokumen_size: number;
  dokumen_type: string;
  dokumen_template: string;
  layanan_id: string;
  ajuan_dok: ajuanDokType
}