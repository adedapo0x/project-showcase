require('dotenv').config()
const express = require('express')
const authRouter = require('./routes/auth.routes')

const app = express()

app.use('/api/v1/auth', authRouter)

app.listen(process.env.PORT, () => {
    console.log("Server up and running")
})


