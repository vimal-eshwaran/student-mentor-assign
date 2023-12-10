const express=require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors=require('cors');
const connectDB =require('./connection')

require("dotenv").config();

//Importing the models
const Mentor = require("./mentor");
const Student = require("./student");
const app = express();
app.use(cors());
const PORT = process.env.PORT;


app.use(bodyParser.json());
connectDB();


app.get("/",(req,res)=>{
  res.status(200).send('The assign-mentor server working ....')

})



  
//1. Creating new Mentor
app.post("/mentor", async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});

//2. Creating new Student
app.post("/student", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 3.Assign one mentor and multiple students
app.post("/mentor/:mentorId/assign", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);

    const students = await Student.find({ _id: { $in: req.body.students } });
    students.forEach((student) => {
      student.currentMentor = mentor._id;
      student.save();
    });
    mentor.students = [
      ...mentor.students,
      ...students.map((student) => student._id),
    ];
    await mentor.save();
    res.send(mentor);
  } catch (error) {
    res.status(400).send(error);
  }
});


//4.Assign and change the mentor
app.put("/student/:studentId/assignMentor/:mentorId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    const newMentor = await Mentor.findById(req.params.mentorId);

    if (student.currentMentor) {
      student.previousMentor.push(student.currentMentor);
    }

    student.currentMentor = newMentor._id;
    newMentor.students.push(student._id);
    await student.save();
    await newMentor.save();
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});


// 5.Show all students for a particular mentor
app.get("/mentor/:mentorId/students", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate(
      "students"
    );
    res.send(mentor.students);
  } catch (error) {
    res.status(400).send(error);
  }
});


//6. API to show the previously assigned mentor for a
//  particular student

app.get("/student/:studentId/previousmentors",async (req,res)=>{
    
  try{
    const student=await Student.findById(req.params.studentId).populate('previousMentor');
     res.send(student);

  }catch(error){
    res.status(400).send(error);
  }


})

app.listen(PORT,()=>{
  console.log("server running on",PORT)
  
})