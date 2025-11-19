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
  layanan: {
    layanan_id: string,
    layanan_jenis: string,
  },
  mahasiswa:{
    nim:string,
    nama:string,
    prodi_id:string,
    prodi:{
      prodi_id:string,
      prodi_name:string
    }
  }
}