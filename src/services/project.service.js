const Project = require('../models/Project');

exports.getAllProjects = async () => {
  return await Project.find({});
};

exports.createProject = async (projectData) => {
  const project = new Project(projectData);
  return await project.save();
};

exports.getProjectById = async (id) => {
  return await Project.findById(id);
};
