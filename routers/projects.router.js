import express from "express";
import * as projectsController from "../controllers/projects.controller.js";

const projectsRouter = express.Router();

projectsRouter.route('/')
    .post(projectsController.createProject)
    .get(projectsController.getProjects);

export default projectsRouter;