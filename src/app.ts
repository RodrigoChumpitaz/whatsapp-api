import express, { Application } from 'express'
import apiv1Routes from "./routes/mock.routes"

class App{
    public app: Application

    constructor(){
        this.app = express()
        this.settings()
        this.mountRoutes()
    }

    settings(){
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
    }

    mountRoutes(){
        this.app.use("/api/v1", apiv1Routes)
    }

}

export default new App().app;