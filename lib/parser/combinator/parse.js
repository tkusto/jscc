module.exports = Parse;

function Parse(parser, input) {
  for (let result of parser(input, 0)) {
    if (result.end >= input.length) {
      return result.value;
    }
  }
  return null;
}
