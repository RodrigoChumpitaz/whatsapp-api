import makeWASocket, { BaileysEventEmitter, WAMessage } from '@whiskeysockets/baileys'
import { ConnectionState, DisconnectReason, useMultiFileAuthState } from '@adiwajshing/baileys'
import pino from 'pino'
import { MessageInfo } from '../interfaces/response.interface';
import fs from 'fs';

export class Baileys{
    private client: BaileysEventEmitter | any;

    constructor(){
        this.init()
    }

    async init(){
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
        this.client = makeWASocket({
            printQRInTerminal: true,
            auth: state as any,
            logger: pino({ level: 'silent' }),
            syncFullHistory: false,
        })
        this.client.ev.on('creds.update', saveCreds);
        this.client.ev.on("connection.update", (update: Partial<ConnectionState | any>) => {
            const { connection, lastDisconnect, isNewLogin } = update
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode && (statusCode !== DisconnectReason.loggedOut)) this.init();
            if (connection === "open") console.log(`Connected to WhatsApp as ${this.client.user.name}`);
            if (isNewLogin) console.log(`Connected to WhatsApp as a new session for ${this.client.user.name}`);
        })  

        this.client.ev.on('contacts.update', (contacts: any) => {
            console.log("contacts events")
            console.log(contacts)
        })

        this.client.ev.on('contacts.upsert', (contacts: any) => {
            console.log("contacts upsert events")
            console.log(contacts)
        })

        // this.client.ev.on('chats.update', (chats: any) => {
        //     console.log("chats events")
        //     console.log(chats)
        // })

        this.client.ev.on('messages.upsert', (info: Partial<WAMessage[] | any>) => {
            const { messages } = info
            const dataMessage = messages[0];
            const InfoMessage: MessageInfo = {
                key: dataMessage?.key,
                messageTimestamp: dataMessage?.messageTimestamp,
                pushName: dataMessage?.pushName,
                broadcast: dataMessage?.broadcast,
                message: dataMessage?.message
            }
            // console.log(InfoMessage)
        })
    }

    async sendTextMessage(remoteJid: string, message: Object): Promise<any>{
        this.client.sendMessage(remoteJid, { text: message })
        return {
            status: "success"
        }
    }

    async sendImageMessage(remoteJid: string, url: string): Promise<any>{
        this.client.sendMessage(remoteJid, { image:  { url } })
        return {
            status: "success"
        }
    }
    
    async sendVideoMessage(remoteJid: string, url: string, description?: string): Promise<any>{
        this.client.sendMessage(remoteJid, {
            video: fs.readFileSync(url),
            caption: `${description ? description : 'Video Description'}`,
            gifPlayback: false
        })
        return {
            status: "success"
        }
    }

    async sendContactMessage(remoteJid: string, contactName: string, contactPhoneNumber: string, organization?: string): Promise<any>{
        const vcard = 'BEGIN:VCARD\n' // metadata of the contact card';
                    + 'VERSION:3.0\n'
                    + `FN:${contactName}\n` // full name
                    + `ORG:${organization ? organization : contactName}\n` // the organization of the contact
                    + `TEL;type=CELL;type=VOICE;waid=51${contactPhoneNumber}:+51 ${contactPhoneNumber}\n`
                    + 'END:VCARD'
        await this.client.sendMessage(
            remoteJid,
            {
                contacts: {
                    displayName: contactName,
                    contacts: [{ vcard }]
                }
            }
        )
        return {
            status: "success"
        }
    }
}
