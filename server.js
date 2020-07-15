require("dotenv").config();
const client = require("twilio")(process.env.accountSid, process.env.authToken);
const fs = require("fs");

const people = require("./people");

// Reusable for all prompts
const ask = text => {
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    process.stdin.write(text);

    process.stdin.on("data", data => resolve(data.toString().trim()));
    process.stdin.on("error", error => reject(error));
  });
};

async function main() {
  const preMessage = await ask("Message to send: ");
  const message = name => preMessage.replace("{{{name}}}", name);

  const numRecipients = parseInt(await ask("Number of recipients: "));

  // Set disallows the same elements
  let inputList = new Set();
  for (let i = 0; i < numRecipients; i++) {
    const name = await ask(`Recipient ${i + 1}: `);
    inputList.add(name.toLowerCase());
  }

  const phoneCalls = [];

  // Transform to Twilio primises
  inputList.forEach(name =>
    phoneCalls.push(
      client.calls.create({
        twiml: `<Response><Say voice="man">${message(name)}</Say></Response>`,
        to: people[name],
        from:
          people[name] == process.env.myNumber
            ? process.env.number
            : process.env.myNumber
      })
    )
  );

  const maxNameLength = 4;

  Promise.all(phoneCalls).then(calls => {
    // Pretty print
    console.log("-----------------------------------------------");
    console.log("| NAME | TO NUMBER    | STATUS | FROM NUMBER  |");
    for (let call of calls) {
      // Force length to maxNameLength
      let name = Object.keys(people)[Object.values(people).indexOf(call.to)];
      let formattedName =
        name.length <= maxNameLength
          ? name + "_".repeat(maxNameLength - name.length)
          : name.slice(0, maxNameLength);

      console.log(
        `| ${formattedName.toUpperCase()} |${call.toFormatted}|SUCCESS |${
          call.fromFormatted
        }|`
      );
    }
    console.log("-----------------------------------------------");

    // Store for memory's sake
    fs.appendFileSync("messages.txt", preMessage + "\n");

    process.exit(0);
  });
}

main();
