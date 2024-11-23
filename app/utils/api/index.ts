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
  retry: { limit: 3 }, // 최대 재시도 횟수 설정
  // hooks: {
  //   afterResponse: [
  //     async (request, options, response) => {
  //       /**
  //        * TODO: Retry count에 대한 처리 필요
  //        * TODO: 토큰 재발급 요청 후 재요청 시나리오 구현
  //        */
  //       if (response.ok) {
  //         return response; // 성공적인 응답인 경우 반환
  //       }

  //       if (response.status === 403) {
  //         // forbidden
  //         const { accessToken } = await ky<{ accessToken: string }>(
  //           "https://api.ticketbell.store/token/renew"
  //         ).json();
  //         request.headers.set("Authorization", `token ${accessToken}`);

  //         return ky(request);
  //       }
  //     },
  //   ],
  // },
});
