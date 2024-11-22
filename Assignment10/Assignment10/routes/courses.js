const express=require("express")
const router=express.Router()
const Courses=require("../models/courses")

router.post("/",async(req,res)=>{
    try {
        const {name,description,duration}=req.body
        const newC=new Courses({name,description,duration})
        let Course=await newC.save()
        res.status(201).json({"data":Course})
    } catch (error) {
        res.status(400).json({"err":error})
    }
})

router.get("/",async(req,res)=>{
    try {
        const courses = await Courses.find()
        res.status(200).json({"data":courses})
    } catch (error) {
        console.log(error)
    }
})

router.get("/:id",async(req,res)=>{
    const {id}=req.params
    try {
        let courseData=await Courses.findById(id)
        res.status(200).json({"data":courseData})
    } catch (error) {
        console.log(error)
    }
})

router.put("/:id",async(req,res)=>{
    const {id}=req.params
    const {name,description,duration}=req.body
    try {
        let updatedCourse=await Courses.findByIdAndUpdate(id,{name,description,duration})
        res.status(200).json({"data":updatedCourse})
    } catch (error) {
        res.status(400).json({"err":error})
    }
})

router.delete("/:id",async(req,res)=>{
    const {id}=req.params
    try {
        let courseData=await Courses.findByIdAndDelete(id)
        res.status(200).json({"data":courseData})
    } catch (error) {
        console.log(error)
    }
})

module.exports=router
