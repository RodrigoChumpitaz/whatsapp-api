export interface Requestbody{
    remoteJid: string;
    message?: string;
    metadata?: {
        contactName: string;
        contactPhoneNumber: string;
        organization?: string;
    },
    description?: string;
}