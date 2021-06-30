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
            if(instructorCourse){
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
            else{
                res.json({message:"invalid username"})
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
                    res.json({message:`assesment ${assesment.title} deleted`});
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
assesment.get('/courseAssesments/:courseId',async(req,res)=>{
    let courseId = req.params.courseId;
    let courseAssesments =await assesmentModel.find({courseId});
    if(courseAssesments[0]){
        res.json({courseAssesments})
    }
    else{
        res.json({message:"no assesment for this course"})
    }
    
})
assesment.get('/allAssesments',async(req,res)=>{
    let assesments =await assesmentModel.find({});
    if(assesments){
        res.json({assesments})
    }
    else{
        res.json({message:"no assesment for this course"})
    }
    
})
assesment.get('/courseExams/:courseId',async(req,res)=>{
    let courseId = req.params.courseId;
    let courseExams = await assesmentModel.find({courseId ,category:"exam"});
    if(courseExams[0]){
        res.json({courseExams});
    }
    else{
        res.json({message : "there is no  Exams for this course"})
    }

})
assesment.get('/courseQuizes/:courseId',async(req,res)=>{
    let courseId = req.params.courseId;
    let courseQuizes = await assesmentModel.find({courseId ,category:"quiz"});
    if(courseQuizes[0]){
        res.json({courseQuizes});
    }
    else{
        res.json({message : "there is no Quizes for this course"})
    }

})

module.exports=assesment;
