const express=require("express")
const router=express.Router()
const Student=require("../models/students")

router.post("/",async(req,res)=>{
    try {
        const {name,age,grade,courses}=req.body
        const nStudent=new Student({name,age,grade,courses})
        const sStudent=await nStudent.save()
        res.status(201).json({data:sStudent})
    } catch (error) {
        res.status(400).json({"err":error})
    }
})

router.get("/",async(req,res)=>{
    try {
        let studentData=await Student.find().populate("courses")
        res.status(200).json({"data":studentData})
    } catch (error) {
        console.log(error)
    }
})

router.get("/:id",async(req,res)=>{
    const {id}=req.params
    try {
        let studentData=await Student.findById(id)
        res.json({"data":studentData})
    } catch (error) {
        console.log(error)
    }
})

router.put("/:id",async(req,res)=>{
    const {id}=req.params
    const {name,age,marks}=req.body
    try {
        let updatedStudent=await Student.findByIdAndUpdate(id,{name,age,marks})
        res.status(200).json({data:updatedStudent})
    } catch (error) {
        res.status(400).json({"err":error})
    }
})

router.delete("/:id",async(req,res)=>{
    const {id}=req.params
    try {
        let studentData=await Student.findByIdAndDelete(id)
        res.status(200).json({"data":studentData})
    } catch (error) {
        console.log(error)
    }
})

module.exports=router
