import User from "../models/User.js";
import { validationResult } from "express-validator";
import Consumable from "../models/Consumable.js";
import Equipment from "../models/Equipment.js";
import OTP from "../models/OTP.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";



const generateOTP=async()=>{
    try{
         const otp=`${Math.floor(1000+Math.random()*9000)}`
         return otp;
    }
    catch(error){

    }
}
const {AUTH_EMAIL, AUTH_PASS,APP_PASS} = process.env;
console.log(AUTH_EMAIL,AUTH_PASS)
export const sendOTP = async(otpDetails)=>{
    try{
        // console.log("check")
        // console.log(req.body);
        const {email,subject,message,duration}=otpDetails;
        if(!duration)duration=1;
        // if(!(email&&subject&&message)){
        //     return res.status(400).json("Enter all input fields");
        // }
        await OTP.deleteOne({email});

        const generatedOTP = await generateOTP();
        let transporter = nodemailer.createTransport({
          service:"Gmail",
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user:AUTH_EMAIL,
                pass:APP_PASS
            }
        })
        const mailOptions ={
            from: AUTH_EMAIL,
            to: email,
            subject,
            html:`<p>${message}</p>
            <p style ="color:tomato; font-size:25-px; letter-spacing:2px;"><b>${generatedOTP}</b></p>
            <p>This code expires in <b>${duration}</b> hour(s). <p>`
            

        }
        await transporter.sendMail(mailOptions);
        const salt = await bcrypt.genSalt(10);
        let secOTP = await bcrypt.hash(generatedOTP, salt);
        const newOTP = await new OTP({
            email,
            otp: secOTP,
            createdAt: Date.now(),
            expiresAt:Date.now()+3600000* +duration
        })
        // res.json({createdOTPRecord})
        const createdOTPRecord = await newOTP.save();
        return createdOTPRecord



    }
    catch(error){
        console.log("wrong")
        throw error;
    }
    
}

export const verifyOTP = async (otpDetails)=>{
    try {
        let {email,otp}=otpDetails;
        // console.log(typeof(otp))
        const matchedOTP = await OTP.findOne({email})
        if(!matchedOTP)return false;
        const {expiresAt}= matchedOTP;
        if(expiresAt<Date.now()){
            await OTP.deleteOne({email})
            return res.status(400).json("Code expired")
        }

        const hashedOTP = matchedOTP.otp;
        
        // const salt = await bcrypt.genSalt(10);
        // let secOTP = await bcrypt.hash(otp, salt);
        // console.log(hashedOTP)
        // console.log(secOTP)
        const validOTP=  await bcrypt.compare(otp,hashedOTP);
        // const validOTP = (secOTP==hashedOTP)
        // res.json({valid:validOTP})
        return validOTP




    } catch (error) {
        throw error;
    }
}
export const deleteOTP = async (email)=>{
    try{
        await OTP.deleteOne({email});
    }
    catch(error){
        throw error
    }
}


export const forgotPasswordEmail =async(req,res)=>{
    try{
      const {username}=req.body;
      console.log(username,req.body.email)
      const user=await User.findOne({username,email:req.body.email});
      console.log(user)
      if(!user){
        return res.status(400).json({error:"Enter valid username and email"})
      }
      const {email} = user;
      console.log(email)
      const otpDetails ={
        email,
        subject:"Password Reset",
        message:"Enter the code below to reset your password",
        duration:1
      }
      const createdOTP=await sendOTP(otpDetails)
      return res.json({success:"email sent successfully"})
      

  
    }
    catch(error){
        throw error
    }
  }
  export const forgotPasswordVerify =async(req,res)=>{
    try{
      const {username, password, otp}=req.body;
    //   console.log(username)
      const user=await User.findOne({username});
    //   console.log(user)
      if(!user){
        return res.status(400).json({error:"Enter valid username"})
      }
     const {email} = user
      console.log(email)
      const otpDetails ={
        email,
        otp
      }
      const valid=await verifyOTP(otpDetails)
      if(!valid){
        return res.status(400).json({error:"Enter valid OTP"});
      }

      const salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(password, salt);
    user.password=secPass
    await deleteOTP(email)
    await user.save()
    return res.json({success:"password updated"})

      

  
    }
    catch(error){
        throw error
    }
  }