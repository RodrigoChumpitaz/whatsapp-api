import multer from "multer";
import fs from "fs";

export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if(!fs.existsSync("./src/uploads/")) fs.mkdirSync("./src/uploads/")
            cb(null, "./src/uploads/")
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    }),
});