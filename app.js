require('dotenv').config()
const express = require('express')
const authRouter = require('./routes/auth.routes')
const projectRouter = require('./routes/project.route')
const { connectToDatabase } = require('./config/database')
const catchAsync = require('./utils/catchAsync')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error.controller')

const app = express()

app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.use('/*', catchAsync(async (req, res, next) => {
    throw new AppError('Route is not found', 404)
}))

app.use(globalErrorHandler)

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


