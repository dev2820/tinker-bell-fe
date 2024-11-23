export const toCookieStorage = (rawCookie: string) => {
  return new Map<string, string>(
    rawCookie
      .split("; ")
      .map(
        (cookieStr): Readonly<[string, string]> =>
          [...cookieStr.split("=", 2), ""].slice(0, 2) as [string, string]
      )
  );
};

export const toRawCookie = (cookieStorage: Map<string, string>) => {
  const [...entries] = cookieStorage.entries();

  return entries.reduce(([key, value]) => {
    return `${key}=${value}; `;
  }, "");
};
