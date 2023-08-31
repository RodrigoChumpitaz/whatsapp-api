import { Router } from "express";
import { upload } from "../middlewares/upload";
import { Controller } from "../controller/api.v1.controller";
import { Baileys } from "../config/Baileys";

class RouteApi{
    router: Router;
    controller: Controller

    constructor(){
        this.router = Router();
        this.controller = new Controller(new Baileys());
        this.mountRoutes();
    }

    mountRoutes(){
        this.router.post('/sendMessage', this.controller.sendTextMessage)

        this.router.post("/sendContact", this.controller.sendContact)

        this.router.post("/sendImage", upload.single("media"), this.controller.sendImage)

        this.router.post("/sendVideo", upload.single("media"), this.controller.sendVideo)

        this.router.post("/sendAudio", upload.single("media"), this.controller.sendAudio)
    }
}

export default new RouteApi().router;