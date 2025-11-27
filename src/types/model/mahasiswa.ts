import prodiType from "./prodi";

export default interface mahasiswaType {
  nim: string,
  password: string,
  nik: string,
  nama: string,
  prodi_id: string,
  prodi: prodiType,
  angkatan: string,
  jenis_kelamin: string,
  tempat_lahir: string,
  tanggal_lahir: string,
  agama: string,
  no_hp: string,
  email: string,
  jalur_masuk: string,
  alamat: string,
  provinsi: string,
  kota: string,
  kecamatan: string,
}