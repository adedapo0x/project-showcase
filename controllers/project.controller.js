const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const project = require('../db/models/project')
const user = require('../db/models/user')
const {sequelize} = require("../config/database");

const createProject = catchAsync(async (req, res, next) =>{
    const { title, projectImage, shortDescription,
     description, projectUrl, category, tags } = req.body

    const userId = req.user.authId

    const newProject = await project.create({
        title, projectImage, shortDescription,
        description, projectUrl, category, tags, createdBy: userId
    })
    return res.status(201).json({
        status: 'success',
        data: newProject
    })
})

const getAllProject = catchAsync(async (req, res, next) => {
    const projects = await project.findAll({include: user})
    const groupedProjects = projects.reduce((acc, project) => {
        const category = project.category
        if (!acc[category]){
            acc[category] = []
        }
        acc[category].push(project)
        return acc
    }, {})

    return res.json({status: "success", groupedProjects})
})

const getProjectByID = catchAsync(async (req, res, next) => {
    const projectId = req.params.id
    const result = await project.findByPk(projectId, { include: user })

    if (!result){
        return next(new AppError('Invalid project id! Project not Found', 404))
    }
    res.json({status: "success", result})
})

const updateProject = catchAsync(async (req, res, next) => {
    const projectId = req.params.id
    const body = req.body

    const proj = await project.findByPk(projectId)
    if (!proj) { return res.status(404).json({message: "Invalid project ID. Project not found"})}

    // verify if it is project owner that wants to verify
    if (!(req.user.authId === proj.createdBy)){
        return res.status(403).json({
            status: "Forbidden",
            message: "You do not have permission to perform this action!"
        })
    }

    proj.title = body.title
    proj.projectImage = body.projectImage
    proj.shortDescription = body.shortDescription
    proj.description = body.shortDescription
    proj.projectUrl = body.projectUrl
    proj.category = body.category
    proj.tags = body.tags

    const updatedProject = await proj.save()
    return res.json({
        status: 'success',
        data: updatedProject
    })
})

const deleteProject = catchAsync(async (req, res, next) => {
    const projectId = req.params.id

    const proj = await project.findByPk(projectId)
    if (!proj) { return res.status(404).json({message: "Invalid project ID. Project not found"})}

    // verify if it is project owner that wants to verify
    if (!(req.user.authId === proj.createdBy)){
        return res.status(403).json({
            status: "Forbidden",
            message: "You do not have permission to perform this action!"
        })
    }

    await proj.destroy()
    return res.json({
        status: 'success',
        message: "Project deleted successfully!"
    })
})
module.exports = { createProject, getAllProject, getProjectByID, updateProject, deleteProject }