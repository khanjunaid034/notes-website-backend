import app from "./app.js"

app.listen(process.env.APP_PORT, "0.0.0.0", err => {
    if (err)
        console.error(err);
    else
        console.log(`Application is running on port: ${process.env.APP_PORT}`);
})