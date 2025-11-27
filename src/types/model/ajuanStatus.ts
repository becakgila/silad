import userType from "./users";

export default interface ajuanStatusType {
    ajuan_status_id: string;
    ajuan_id: string;
    user_id: string;
    progress: number;
    dok_url: string;
    users: userType[];
}