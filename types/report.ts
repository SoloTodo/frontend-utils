import {User} from "./user";

export type Report = {
    id: number;
    name: string;
    slug: string;
    url: string;
};

export type ReportDownload = {
    id: number;
    url: string;
    timestamp: string;
    status: 1 | 2 | 3 | 4;
    report: Report,
    user: User
};


export const ReportDownloadStatusDict: Record<number, string> = {
    1: 'Pendiente',
    2: 'En proceso',
    3: 'Exitoso',
    4: 'Error'
}