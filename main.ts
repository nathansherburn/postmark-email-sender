import { parse } from "jsr:@std/csv";

const POSTMARK_SERVER_TOKEN = Deno.env.get("POSTMARK_SERVER_TOKEN");

if (!POSTMARK_SERVER_TOKEN) {
  throw new Error("POSTMARK_SERVER_TOKEN is required");
}

const template = Deno.readTextFileSync("./template.html");

const csvData = Deno.readTextFileSync("./data.csv");
const data = parse(csvData, { skipFirstRow: true });
console.log(data);

const render = (template: string, data: { [key: string]: string }) => {
  return template.replace(/{{(.*?)}}/g, (_, match) => data[match.trim()] || "");
};

const sendEmail = async (emailData: object) => {
  console.log("Sending email...", emailData);
  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(`Error: ${response.statusText}`);
  }

  return await response.json();
};

// Send email
data.forEach((row) => {
  const emailData = {
    From: "example@example.com",
    To: row.email,
    Subject: `Hi ${row.name} - this is a test email`,
    HtmlBody: render(template, row),
    ReplyTo: "example@example.com",
    TrackOpens: true,
    TrackLinks: "None",
    MessageStream: "outbound",
  };
  sendEmail(emailData)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
});
