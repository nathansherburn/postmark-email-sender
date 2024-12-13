# Quick and simple Postmark email sender
A Deno-based batch emailing script for Postmark.

## Requirements
1. Deno 2+
2. Postmark API key
3. Some data

# How to use
1. Bring your Postmark API key and pop it in `.env`
2. Plug some data into `data.csv`
3. Reference the data in your template like this `{{name}}`
4. Run the script to send: `deno run start`
