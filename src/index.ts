import http from 'http';
import app from './app'

const server = http.createServer(app)

server
    .listen(3000)
    .on("listening",() => {
        console.log("Listening on port 3000")
    })
    .on("error", (err: Error) => {
        console.log(err)
        process.exit(1)
    })