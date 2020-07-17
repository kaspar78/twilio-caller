/**
 * Take the prompt user input and clean it
 * @param   {Buffer} input
 * @returns {String}
 */
const cleanInput = input => input.toString().trim().toLowerCase();

/**
 * Takes an array of strings and returns the string that is the longest
 * @param   {Set<String>} list
 * @returns {String}        The longest string in the array
 */
const longest = list =>
  Array.from(list).reduce((a, b) => (a.length > b.length ? a : b));

/**
 * Gets the name using the number from the list
 * @param   {Object} obj
 * @param   {String} number
 * @returns {String}        The name of the person whose number it is
 */
const getName = (obj, number) =>
  Object.keys(obj)[Object.values(obj).indexOf(number)];

/**
 * Makes the string the length of @param length by appending "_" characters. Does not make strings shorter.
 * @param   {String}  name
 * @param   {Int}     length
 * @returns {String}          The name with extra __ at the end
 */
const forceLength = (name, length) => name + "_".repeat(length - name.length);

module.exports = { cleanInput, longest, getName, forceLength };
