import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "./s3client.js";

export const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            // console.log("Uploading file");
            const filename = `uploads/${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    }),
    limits: {
        fileSize: 20 * 1024 * 1024      // 20 MB
    }
});

