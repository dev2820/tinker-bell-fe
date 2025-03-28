import { routerPush } from "@/utils/helper/app";
import { json, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "terra-design-system/react";

export async function loader() {
  const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  const API_URL = process.env.API_URL;
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${API_URL}/oauth/redirect&response_type=code`;
  const appleLoginUrl = `https://appleid.apple.com/auth/authorize?client_id=store.ticketbell&redirect_uri=${API_URL}/oauth/redirect/apple&response_type=code&scope=email&response_mode=form_post`;

  return json({
    kakaoLoginUrl,
    appleLoginUrl,
  });
}

export default function Login() {
  const { kakaoLoginUrl, appleLoginUrl } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full h-[400px] p-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          로그인
        </h2>
        <div className="flex flex-col place-items-center gap-3">
          <Link to={kakaoLoginUrl}>
            <img
              src="/kakao_login_medium_narrow.png"
              alt="kakao login"
              className="h-[45px] w-auto"
            />
          </Link>
          <Link to={appleLoginUrl}>
            <img
              src="/appleid_button@2x.png"
              alt="kakao login"
              className="h-[45px] w-auto"
            />
          </Link>
          <Button
            className="w-[183px] h-[45px] my-auto"
            variant="outline"
            onClick={() => routerPush(navigate, "/experience")}
          >
            로그인 없이 체험하기
          </Button>
        </div>
      </div>
    </div>
  );
}
