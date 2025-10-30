import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv';
dotenv.config();

interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const register = async ({firstName,email,lastName,password}:RegisterParams) => {
    const findUser=await userModel.findOne({email})

    if( findUser){
        return {data:"User already exists!",statusCode:400}
    }
    const hashedPassword= await bcrypt.hash(password,10);
    const newUser = new userModel({email,password:hashedPassword,firstName,lastName})
    await newUser.save()

    return {data:generateJWT({email,firstName,lastName}),statusCode:200};
};

interface LoginParams {
    email: string;
    password: string;
  }

export const login = async ({email,password}:LoginParams) => {
    const findUser=await userModel.findOne({email})
    if(!findUser){
        return {data:"Incorrect email or password!",statusCode:400}
    }

    // If the account was created via Microsoft SSO, it may not have a password
    if (!findUser.password) {
        return {data:"This account uses Microsoft login. Please sign in with Microsoft.",statusCode:400}
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password as string);
    if(passwordMatch){
        return {data:generateJWT({email,firstName:findUser.firstName,lastName:findUser.lastName}),statusCode:200};
    }
    return {data:"Incorrect email or password!",statusCode:400}
    
};

const generateJWT=(data:any)=>{
return jwt.sign(data,process.env.JWT_SECRET as string)
}
