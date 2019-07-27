/**
 * Create a new error and print it to the console
 * @param newError - error string to print
 * @param loud - throw an error?
 * @returns - false
 */
export const Error = (newError: string, loud = false) => {
  if (loud) {
    throw Error("V4.js Exception: " + newError);
  } else {
    console.error("V4.js Error: " + newError);
  }
  return false;
};
