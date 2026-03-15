import express from "express";
import * as paymentsController from "../controllers/payments.controller.js";
import * as usersController from "../controllers/users.controller.js";

const paymentsRouter = express.Router();

paymentsRouter.route('/payment')
    .post(usersController.verifyJwt, paymentsController.createOrder)
    .patch(usersController.verifyJwt, paymentsController.verifyPayment);

export default paymentsRouter;