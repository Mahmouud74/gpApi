const mongoose=require('mongoose');

 const strudenCourseSchema=mongoose.Schema({

    userID : {type : mongoose.Schema.Types.ObjectId , ref : 'user'},
    courseId:{type:mongoose.Schema.Types.ObjectId , ref:'course' , required:false},
    grades:[{assesmentTitle:String , grade : String , assesmentCategory:String}]
});
module.exports = mongoose.model('student_course', strudenCourseSchema);
