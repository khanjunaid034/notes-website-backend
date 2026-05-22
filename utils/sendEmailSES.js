import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.SMTP_USER,
    secretAccessKey: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (input) => {
  const params = {
    Source: input.from,
    Destination: {
      ToAddresses: [input.to],
    },
    Message: {
      Subject: {
        Data: input.subject,
      },
      Body: {
        Text: {
            Data: input.body
        },
        Html: {
          Data: input.html,
        },
      },
    },
  };

  try {
    const result = await client.send(new SendEmailCommand(params));
    console.log("Email sent:", result.MessageId);
  } catch (err) {
    console.error("Error:", err);
  }
};

export default sendEmail;