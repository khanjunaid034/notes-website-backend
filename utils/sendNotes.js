import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../utils/s3client.js";
import { GetObject$, GetObjectCommand } from "@aws-sdk/client-s3";
import { pool } from "../db.js";
import { transporter } from "../sendEmail.js";

function parseS3Url(url) {
    const u = new URL(url);

    const bucket = u.hostname.split(".")[0];
    const key = decodeURIComponent(u.pathname.slice(1));

    return { bucket, key };
}

export const emailNotes = async (id) => {
    const purchase_id = id;
    const myQuery = `SELECT n.url, u.email, pu.notes_id
        FROM purchased_notes pu
        INNER JOIN users u ON pu.user_id = u.id
        INNER JOIN notes n ON n.id = pu.notes_id
        WHERE pu.id =  $1 AND pu.ispaymentverified = $2
    `;

    
    const result = await pool.query(myQuery, [purchase_id, true]);
    const { email, url} = result.rows[0];

    const { bucket, key } = parseS3Url(url);

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 7200 });

    transporter.sendMail({
        from: '"Computer Science Teacher" <junedaws4@gmail.com>',
        to: email,
        subject: "Order Arrived - Notes from Computer Science Teacher",
        html: `
            <h3>Please use the below link to download the notes</h3>
            <p>Please note that the link will expire in 2 hours, please ensure to download and keep a copy with you.</p>
            <p>Download link: <a href=${signedUrl}>download here</a><p>
            <h3>Computer Science Teacher</h3>
        `
    });
}

