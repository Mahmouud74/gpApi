const profile = require('express').Router();
const userModel = require('../models/user.model');
const studentCourseModel = require('../models/studentCourse.model');
const courseModel = require('../models/course.model');
const assigmentSolutionModel = require('../models/assigmentSolution.model')

profile.get('/userProfile/:username',async(req,res)=>{
    let username = req.params.username;
    let user = await userModel.findOne({username});
    console.log(user.role);
    if(user.role === "student")
    {
        let studentCourses = await studentCourseModel.find({userID:user._id});
        Let registeredCourses 
        for(let i=0;i<studentCourses.length;i++){ 
              registeredCourses.push(await courseModel.findOne({_id:studentCourses[i].courseId}))
        }
        let assigmentSolutions = await assigmentSolutionModel.find({userId:user._id})
        res.json({user,registeredCourses , assigmentSolutions})
    }
    else if (user.role === "instructor"){
        let instructorCourses = await courseModel.find({instructorId: user._id })
        res.json({user , instructorCourses});
    }
    else if (user.role === "admin"){
        res.json({user});
    }
    else
    {
        res.send('hello')

    }
})

module.exports=profile;
