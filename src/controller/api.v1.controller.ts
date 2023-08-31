import { Request, Response } from "express";
import { Requestbody } from "src/interfaces/request.interface";
import { Baileys } from '../config/Baileys'

export class Controller{
    constructor(private wtsp: Baileys){
        this.sendTextMessage = this.sendTextMessage.bind(this);
        this.sendContact = this.sendContact.bind(this);
        this.sendImage = this.sendImage.bind(this);
        this.sendVideo = this.sendVideo.bind(this);
        this.sendAudio = this.sendAudio.bind(this);
    }

    public async sendTextMessage(req: Request, res: Response){
        try {
            const { remoteJid, message }: Requestbody = req.body;

            if(!remoteJid && !message){
                return res.status(400).json({
                    message: "Bad Request"
                })
            }

            const response = await this.wtsp.sendTextMessage(remoteJid, message)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                message: `Error: ${error.message}`
            })
        }
    }

    public async sendContact(req: Request, res: Response){
        try {
            const { remoteJid, metadata }: Requestbody = req.body;
            const { contactName, contactPhoneNumber, organization } = metadata;
            if([remoteJid, contactName, contactPhoneNumber].includes(undefined)){
                return res.status(400).json({
                    message: "Missing required parameters"
                })
            }
            const response = await this.wtsp.sendContactMessage(remoteJid, contactName, contactPhoneNumber, organization);
            return res.json(response)
        } catch (error) {
            return res.status(500).json({
                message: `Error: ${error.message}`
            })
        }
    }


    public async sendImage(req: Request, res: Response){
        try {
            const { remoteJid } = req.body;
            const { file } = req;
            const fileUrl = `${file.destination}/${file.originalname}`
            const response = await this.wtsp.sendImageMessage(remoteJid, fileUrl)
            return res.json(response)
        } catch (error) {
            return res.status(500).json({
                message: `Error: ${error.message}`
            })
        }
    }

    public async sendVideo(req: Request, res: Response){
        try {
            const { remoteJid, description }: Requestbody = req.body;
            const { file } = req;
            const fileUrl = `${file.destination}/${file.originalname}`
            const response = await this.wtsp.sendVideoMessage(remoteJid, fileUrl, description)
            return res.json(response)
        } catch (error) {
            return res.status(500).json({
                message: `Error: ${error.message}`
            })
        }       
    }

    public async sendAudio(req: Request, res: Response){
        try {
            const { remoteJid }: Requestbody = req.body;
            const { file } = req;
            const fileUrl = `${file.destination}/${file.originalname}`
            const response = await this.wtsp.sendAudioMessage(remoteJid, fileUrl)
            return res.json(response)
        } catch (error) {
            return res.status(500).json({
                message: `Error: ${error.message}`
            })
        }
    }
}