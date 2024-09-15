require('dotenv').config()
const express = require('express')
const authRouter = require('./routes/auth.routes')
const { connectToDatabase } = require('./config/database')

const app = express()
app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.use('/*', (req, res, next) => {
    return res.status(404).json({message: "Page Not Found!"})
})

const startServer = async () =>{
    try{
        await connectToDatabase()
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log("Server up and running")
        })
    } catch (e) {
        console.error('Failed to start server as DB is not yet connected!', e)
    }
}

startServer()


