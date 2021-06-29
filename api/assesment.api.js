const courseModel = require('../models/course.model');
const assesment = require('express').Router();
const studentCourseModel = require('../models/studentCourse.model');
const userModel = require("../models/user.model");
const assesmentModel = require('../models/assesment.model')
const jwt=require("jsonwebtoken");
assesment.post('/createAssesment',async(req,res)=>{
    const {openDate , dueDate , category ,courseId , fullMark ,questions , token , username,title} = req.body;
    jwt.verify(token ,"instructor" ,async (err, decodded)=>{
        if(err){
            res.json({message:"error in token"})
        }
        else{
            let instructorCourse = await userModel.findOne({username})
            let course = await courseModel.findOne({_id:courseId , instructorId:instructorCourse._id});
            if(course){
                const assesment = await assesmentModel.findOne({courseId:course._id , title});
                if(assesment){
                    res.json({message:"please enter another title"})
                }
                else{
                    await assesmentModel.insertMany({openDate , dueDate, category ,courseId, fullMark , questions,title});
                    res.json({message:"done"})
                }
            }
            else
            {
                res.json({message:"invalidCourse"})
            } 
    }
    })

    
})
assesment.get("/solveAssesment/:assesmentId", async(req,res)=>{
    let _id = req.params.assesmentId;
    const assesment = await assesmentModel.findOne({_id })
    res.json({assesment});         
     
})
assesment.delete("/deleteAssesment/:assesmentId",async(req,res)=>{
    const {username , token} = req.body;
    jwt.verify(token , "instructor" , async(err,decodded)=>{
        if(err){
            res.json("error in token");
        }
        else{
            let _id = req.params.assesmentId;
            const assesment = await assesmentModel.findOne({_id })
            const instructor = await userModel.findOne({username});
            if(instructor){
                const course = await courseModel.findOne({_id:assesment.courseId , instructorId:instructor._id});
                if(course){
                    await assesmentModel.deleteOne({_id});
                    res.json({message:`assesmt ${assesment.title} deleted`});
                }
                else{
                    res.json({message:"you haven't acces to this exam"})
                }
            }
            else{
                res.json({message:"invalid username"})
            }

        }
    })
})

module.exports=assesment;
