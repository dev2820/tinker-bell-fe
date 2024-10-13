/**
 * Checks if the current code is running on the server or the browser.
 *
 * @returns {string} A string indicating whether the code is running on the "server" or "browser".
 */
export const getEnvironment = (): "browser" | "server" => {
  if (typeof window === "undefined") {
    return "server";
  } else {
    return "browser";
  }
};
