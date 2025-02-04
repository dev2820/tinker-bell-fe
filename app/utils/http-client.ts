import ky from "ky";
import Cookies from "js-cookie";

export const httpClient = ky.create({
  prefixUrl: "https://api.ticketbell.store",
  headers: {
    "content-type": "application/json",
    // TODO: accessToken은 Cookie가 아닌 메모리에서 들고 있게 수정 필요
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
  retry: { limit: 3 },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        /**
         * TODO: Retry count에 대한 처리 필요
         * TODO: 토큰 재발급 요청 후 재요청 시나리오 구현
         */
        if (response.ok) {
          return response; // 성공적인 응답인 경우 반환
        }

        if (response.status === 403) {
          // TODO: accessToken이 만료되면 refreshToken을 재발급하게 해야함
          await ky<{ accessToken: string }>(
            "https://api.ticketbell.store/token/renew"
          ).json();
          request.headers.set(
            "Authorization",
            `Bearer ${Cookies.get("accessToken")}`
          );

          return ky(request);
        }
      },
    ],
  },
});
