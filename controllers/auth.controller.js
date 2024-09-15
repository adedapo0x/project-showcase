const user = require('../db/models/user')
const signUp = async (req, res) =>{
    try{
        const { userType, firstName, lastName, email, password, confirm_pw } = req.body

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
            userType, firstName, lastName, email, password
        })

        if (!newUser){
            return res.status(400).json({message: 'Invalid user credentials'})
        }
    } catch{

    }
}