const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { validateProject } = require('../middlewares/validation.middleware');

router.get('/', projectController.getAllProjects);
router.post('/', validateProject, projectController.createProject);

module.exports = router;
