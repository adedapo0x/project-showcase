const catchAsync = require('../utils/catchAsync')
const project = require('../db/models/project')

const createProject = catchAsync(async (req, res, next) =>{
    const { title, projectImage, shortDescription,
     description, projectUrl, category, tags } = req.body

    const newProject = await project.create({
        title, projectImage, shortDescription,
        description, projectUrl, category, tags, createdBy: 1
    })

    return res.status(201).json({
        status: 'success',
        data: newProject
    })
})

module.exports = { createProject }