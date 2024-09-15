require('dotenv').config()
const express = require('express')
const authRouter = require('./routes/auth.routes')

const app = express()
app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.use('/*', (req, res, next) => {
    return res.status(404).json({message: "Page Not Found!"})
})
app.listen(process.env.PORT, () => {
    console.log("Server up and running")
})


