const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const user = require('../db/models/user')

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN})
}

const signUp = async (req, res) =>{
    try{
        const { userType, firstName, lastName, email, password, confirmPassword } = req.body

        const existingUser = await user.findOne({ where: { email }})
        if (existingUser){
            return res.status(400).json({message: "Email already in use. Try another email!"})
        }

        if (!['0', '1'].includes(userType)){
            return res.status(400).json({
                status: 'failed',
                message: "Invalid user type for sign up"
            })
        }

        const newUser = await user.create({
            userType, firstName, lastName, email, password, confirmPassword
         })

        const result = newUser.toJSON()
        delete result.password
        delete result.deletedAt

        result.token = generateAccessToken({ authId: result.id })

        if (!result){
            return res.status(400).json({message: 'Invalid user credentials'})
        }

        return res.status(201).json({status: 'success',
        message: "User created successfully!", data: result})
    } catch(err){
        console.log(err)
        res.status(400).json({message: "Error encountered. Please check all inputted details and try again"})
    }
}


const logIn = async (req, res) => {
    try{
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({status: "error",
            message: "Please provide email and password"})
        }

        const result = await user.findOne({ where: { email }})
        if (!result || !(await bcrypt.compare(password, result.password) )){
            return res.status(401).json({status: 'failed',
            message: "Incorrect email or password!"})
        }

        const token = generateAccessToken({ authId: result.id })
        return res.json({status: "success", token })
    } catch{
        console.log(e)
        return res.status(400).json({message: "Error encountered, login not successful!"})
    }
}
module.exports = { signUp, logIn }