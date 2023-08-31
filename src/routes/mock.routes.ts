import { Request, Response, Router } from "express";
import { Requestbody } from '../interfaces/request.interface'
import { Baileys } from '../config/Baileys'
import { upload } from "../middlewares/upload";

class RouteApi{
    router: Router;

    constructor(private wtsp: Baileys){
        this.router = Router();
        this.mountRoutes();
    }

    mountRoutes(){
        this.router.post('/sendMessage', async (req: Request, res: Response) => {
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
        })

        this.router.post("/sendContact", async (req: Request, res: Response) => {
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
        })

        this.router.post("/sendImage", upload.single("media"),async (req: Request, res: Response) => {
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
        })

        this.router.post("/sendVideo", upload.single("media"),async (req: Request, res: Response) => {
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
        })
    }
}

export default new RouteApi(new Baileys()).router;