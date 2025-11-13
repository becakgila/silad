import userHaksType from "./userHaks";

export default interface modulType {
    modul_id: string;
    modul_name: string;
    modul_induk: number;
    modul_urut: string;
    modul_url: string;
    modul_aktif: string;
    modul_simbol: string;
    user_haks: userHaksType[];
    modul_akses: string;
    modul_newtab: string;
    modul_id_sms: string;
    created_at: string;
    updated_at: string;    
}