# twilio-caller

A nodeJS script to call friends with automated messages!

## TO USE:

### Clone this repository

This project is based on a mapping from names to numbers. As seen in the `.gitignore`, there is a people.js file that is not included in Github (it contains many of my friends and family's numbers). Be sure to create one in the following format:

```
const people = {
  name1: "+18887773333",
  name2: "+19991112222,
  ...
}
module.exports = people;
```

### Get a verified number from twilio (or use mine)

### Run `node server.js` and go!

It will ask you some questions. The message to input is simply a string with a replace. Every instance of `{{{name}}}` in the message string will be replaced for each recipient with their name. Then, input the number of recipients, and name them all! Each inputted name must correspond to their key in the people object.
