import express from "express";
import * as notesController from "../controllers/notes.controller.js";
import * as usersController from "../controllers/users.controller.js";
import { upload } from "../utils/multer.uploads3.js";

const notesRouter = express.Router();

notesRouter.route('/')
    .post(usersController.verifyJwt, usersController.checkAdmin, upload.fields([{ name: 'coverImg', maxCount: 1 }, { name: 'notesPdf', maxCount: 1 }]), notesController.addNotes)
    .get(notesController.getNotes);


export default notesRouter;