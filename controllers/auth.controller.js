const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const user = require('../db/models/user')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN})
}

const signUp = catchAsync(async (req, res, next) =>{
        const { userType, firstName, lastName, email, password, confirmPassword } = req.body
        console.log(user)
        const existingUser = await user.findOne({ where: { email }})
        if (existingUser){
            return next(new AppError('Email already in use. Try another email!', 400))
        }

        if (!['0', '1'].includes(userType)){
            throw new AppError('Invalid user type', 400)
        }

        const newUser = await user.create({
            userType, firstName, lastName, email, password, confirmPassword
         })

        if (!newUser){
            return next(new AppError('Invalid user credentials', 400))
        }

        const result = newUser.toJSON()
        delete result.password
        delete result.deletedAt

        result.token = generateAccessToken({ authId: result.id, userType: result.userType })

        return res.status(201).json({status: 'success',
        message: "User created successfully!", data: result})
})


const logIn = catchAsync(async (req, res, next) => {
        const { email, password } = req.body
        if (!email || !password) {
            return next(new AppError("Please provide email and password", 400))
        }

        const result = await user.findOne({ where: { email }})
        if (!result || !(await bcrypt.compare(password, result.password) )){
            return next(new AppError("Incorrect email or password!", 401))
        }

        const token = generateAccessToken({ authId: result.id, userType: result.userType })
        return res.json({status: "success", token })
})

const authenticateToken = catchAsync(async (req, res, next) => {
    let token = ''
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
       token = req.headers.authorization.split(' ')[1]
    } else {
        return next(new AppError('Unauthorized! Please login to get access', 401))
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY)
    console.log(req.user)
    if (!req.user){
        return next(new AppError('User does not exist!', 400))
    }
    next()
})

const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)){
            return next(new AppError("You do not have permission to perform this action", 403))
        }
        next()
    }
    return checkPermission
}

module.exports = { signUp, logIn, authenticateToken, restrictTo }