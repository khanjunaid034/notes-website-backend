import express from "express";
import * as usersController from "../controllers/users.controller.js";
import rateLimit from "express-rate-limit";

const usersRouter = express.Router();

const sendOtpLimit = rateLimit({
    limit: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    handler: (req, res) => {
        res.status(429).json({
            message: `Limit reached, please try again after 15 minutes.`
        })
    }
});

/* to login and get a jwt */
usersRouter.route('/login')
    .post(sendOtpLimit, usersController.loginUser);

/* verify the otp */
usersRouter.route('/verifyLogin')
    .post(usersController.verifyLogin);


usersRouter.route('/getUsers')
    .get(usersController.getUsers);


/* test routes */
usersRouter.route('/verifyJwt')
    .post(usersController.verifyJwt);


export default usersRouter;