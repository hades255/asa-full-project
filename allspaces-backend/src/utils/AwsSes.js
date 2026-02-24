import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize AWS SES client (AWS SDK v3)
// Required env vars: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (or AWS_ACCESS_SECRET), SES_FROM_EMAIL
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_ACCESS_SECRET || "",
  },
});

/**
 * Send an email via AWS SES
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Optional plain text body
 * @param {string|string[]} [options.cc] - Optional CC
 * @param {string|string[]} [options.bcc] - Optional BCC
 * @param {string} [options.from] - Override default from address
 * @returns {Promise<AWS.SES.SendEmailResponse>}
 */
export async function sendEmail({ to, subject, html, text, cc, bcc, from }) {
  if (!to || !subject || !html) {
    throw new Error("to, subject and html are required to send an email");
  }

  const toAddresses = Array.isArray(to) ? to : [to];
  const ccAddresses = cc ? (Array.isArray(cc) ? cc : [cc]) : undefined;
  const bccAddresses = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined;

  const fromAddress = from || process.env.SES_FROM_EMAIL;
  if (!fromAddress) {
    throw new Error("SES_FROM_EMAIL env var is required or provide 'from'");
  }

  const command = new SendEmailCommand({
    Source: fromAddress,
    Destination: {
      ToAddresses: toAddresses,
      ...(ccAddresses?.length ? { CcAddresses: ccAddresses } : {}),
      ...(bccAddresses?.length ? { BccAddresses: bccAddresses } : {}),
    },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: html, Charset: "UTF-8" },
        ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}),
      },
    },
  });
  const result = await sesClient.send(command);
  return result;
}

export default { sendEmail };
