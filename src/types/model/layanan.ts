import dokumenType from "./dokumen";

export default interface layananType {
  layanan_id: string;
  layanan_jenis:string;
  layanan_lvl:string;
  dokumens: dokumenType[];
}