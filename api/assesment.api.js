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
module.exports=assesment;