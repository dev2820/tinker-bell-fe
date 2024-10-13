import ky, { HTTPError } from "ky";

export const isHTTPError = (error: unknown): error is HTTPError => {
  return error instanceof Error && error.name === "HTTPError";
};

export const publicAPI = ky.create({
  prefixUrl: "https://api.ticketbell.store",
  headers: {
    "content-type": "application/json",
  },
});

export const authAPI = ky.create({
  prefixUrl: "https://api.ticketbell.store",
  headers: {
    "content-type": "application/json",
  },
  hooks: {
    afterResponse: [
      // async (request, options, response) => {
      /**
       * TODO: Retry count에 대한 처리 필요
       * TODO: 토큰 재발급 요청 후 재요청 시나리오 구현
       */
      // if (response.status === StatusCodes.FORBIDDEN) {
      //   const token = await ky("https://example.com/token").text();
      //   // Retry with the token
      //   request.headers.set("Authorization", `token ${token}`);
      //   return ky(request);
      // }
      // },
    ],
  },
});
