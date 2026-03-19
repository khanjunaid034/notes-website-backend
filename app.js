import express from "express";
import projectsRouter from "./routers/projects.router.js";
import usersRouter from "./routers/users.router.js";
import paymentsRouter from "./routers/payments.router.js";
import notesRouter from "./routers/notes.router.js";
import multer from "multer";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";


/* rate limiter config */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    // message: "Too many requests, please try again in 15 minutes."
    handler: (req, res) => {
        res.status(429).json({message: `Too many requests, please try again later.`})
    }
});

const app = express();

/* protection packages */
if(process.env?.NODE_ENV == 'dev') {
    app.use(cors());
}

app.use(helmet());

// app.use(limiter);
app.use(hpp());


/* enable use of json in express */
app.use(express.json());


/* routers */
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/notes', notesRouter);
app.use('/api/v1/payments', paymentsRouter);


/* global error handler */
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            status: false,
            message: err.message,
            code: err.code
        })
    }

    if (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
    next();
})


export default app;