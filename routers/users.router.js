import express from "express";
import * as usersController from "../controllers/users.controller.js";

const usersRouter = express.Router();

/* to login and get a jwt */
usersRouter.route('/login')
    .post(usersController.loginUser);

/* verify the otp */
usersRouter.route('/verifyLogin')
    .post(usersController.verifyLogin);


usersRouter.route('/getUsers')
    .get(usersController.getUsers);


/* test routes */
usersRouter.route('/verifyJwt')
    .post(usersController.verifyJwt);


export default usersRouter;