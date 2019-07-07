/**
 * Create a new error and print it to the console
 * @param newError - error string to print
 * @returns - false
 */
export const Error = (newError: string) => {
    const errorString = "V4.js Error => ";
    console.error(errorString + newError);
    return false;
};
