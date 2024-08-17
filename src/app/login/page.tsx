import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.API_URL;
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;

export default async function LoginPage() {
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${API_URL}/oauth/redirect&response_type=code`;

  return (
    <div className="flex items-center justify-center h-screen">
      {/* 로컬 BE 실행시 redirect_uri=http://localhost:8080/oauth/redirect 로 변경 */}
      <Link href={kakaoLoginUrl}>
        <Image
          src="/assets/images/kakao_login_medium_narrow.png"
          width={150}
          height={50}
          alt="kakao"
        />
      </Link>
    </div>
  );
}
