const user = require('../db/models/user')
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



        if (!newUser){
            return res.status(400).json({message: 'Invalid user credentials'})
        }

        return res.status(201).json({status: 'success',
        message: "User created successfully!", data: newUser})
    } catch(err){
        console.log(err)
        res.status(400).json({message: "Error encountered. Please check all inputted details and try again"})
    }
}

module.exports = signUp