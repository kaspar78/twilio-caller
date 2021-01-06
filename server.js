require("dotenv").config();
const client = require("twilio")(process.env.accountSid, process.env.authToken);
const fs = require("fs");
const prompt = require("prompt-sync")();

// Custom library files
const people = require("./people");
const { cleanInput, getName, longest, forceLength } = require("./lib");

// Recursive checking for input being in people object
const keepAsking = (name) => {
  if (name in people) {
    return name;
  } else {
    let nameForChecking = ask(
      `Invalid name: ${name}. Please enter a valid name: `
    );

    return keepAsking(nameForChecking);
  }
};

// Wrapper to cleanup input
const ask = (text) => cleanInput(prompt(text));

const preMessage = ask("Message to send: ");
const message = (name) => preMessage.replace("{{{name}}}", name);

const numRecipients = parseInt(ask("Number of recipients: "));

// Set disallows the same elements
let inputList = new Set();
for (let i = 0; i < numRecipients; i++) {
  let name = ask(`Recipient ${i + 1}: `).toLowerCase();
  name = keepAsking(name);
  inputList.add(name);
}

// Transform to Twilio promises
let calls = Array.from(inputList).map((name) =>
  client.calls.create({
    twiml: `<Response><Say voice="man">${message(name)}</Say></Response>`,
    to: people[name],
    from:
      people[name] == process.env.myNumber
        ? process.env.number
        : process.env.myNumber,
  })
);

const longestLength = longest(inputList).length;

Promise.all(calls).then((calls) => {
  // Pretty print
  const nameField = forceLength("NAME", longestLength);
  console.log("-".repeat(34 + nameField.length));
  console.log(`| ${nameField} | TO_NUMBER___ | FROM_NUMBER_ |`);
  for (let call of calls) {
    let name = getName(people, call.to);
    let formattedName = forceLength(name, longestLength);

    console.log(
      `| ${formattedName.toUpperCase()} |${call.toFormatted}|${
        call.fromFormatted
      }|`
    );
  }
  console.log("-".repeat(34 + nameField.length));

  // Store for memory's sake
  fs.appendFileSync("messages.txt", preMessage + "\n");

  process.exit(0);
});
