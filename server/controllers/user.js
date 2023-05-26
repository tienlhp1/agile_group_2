import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.SECRET;

import User from '../models/userModel.js'
import ProfileModel from '../models/ProfileModel.js';


export const signin = async (req, res)=> {
    const { email, password } = req.body //Coming from formData

    try {
        const existingUser = await User.findOne({ email })
        
        //get userprofile and append to login auth detail
        const userProfile = await ProfileModel.findOne({ userId: existingUser?._id })

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

        //If crednetials are valid, create a token for the user
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" })
        
        //Then send the token to the client/frontend
        res.status(200).json({ result: existingUser, userProfile, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"})
    }
}



export const signup = async (req, res)=> {
    const { email, password, confirmPassword, firstName, lastName, bio } = req.body

    try {
        console.log("====HELLO SERVER====")
        const existingUser = await User.findOne({ email })
        const userProfile = await ProfileModel.findOne({ userId: existingUser?._id })

        if(existingUser) return res.status(400).json({ message: "User already exist" })

        if(password !== confirmPassword) return res.status(400).json({ message: "Password don't match" })
        
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, bio })

        const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" })
        
        res.status(200).json({ result, userProfile, token })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong"}) 
    }
}

