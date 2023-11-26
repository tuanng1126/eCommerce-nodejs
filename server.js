const app = require('./src/app')

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`Server start with port ${PORT}`)
})

process.on("SIGINT", () => {
    server.close(() => {
        console.log(`Server exit`)
        process.exit()
    })
})