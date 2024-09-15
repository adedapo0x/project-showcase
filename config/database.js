const { Sequelize } = require('sequelize')
const env = process.env.NODE_ENV || 'development'

const config = require('./config')[env]
const sequelize = new Sequelize(config)


const connectToDatabase = async ()=>{
    try{
    await sequelize.authenticate()
    console.log("Connection to database successful")
    } catch (e){
        console.log("Unable to connect to database: ", e)
    }
}

module.exports = { sequelize, connectToDatabase }


