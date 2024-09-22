const router = require('express').Router()
const { createProject, getAllProject, getProjectByID, updateProject, deleteProject} = require('../controllers/project.controller')
const { authenticateToken } = require("../controllers/auth.controller");

router.get('/', getAllProject)
router.post('/add', authenticateToken, createProject)
router.route('/:id')
    .get(authenticateToken, getProjectByID)
    .patch(authenticateToken, updateProject)
    .delete(authenticateToken, deleteProject)

module.exports = router


