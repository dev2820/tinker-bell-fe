import Image from "next/image";
import Link from "next/link";

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex items-center justify-center h-screen">
      {/* 로컬 실행시 redirect_uri=http://localhost:8080/oauth/redirect 로 변경 */}
      <Link href="https://kauth.kakao.com/oauth/authorize?client_id=a9e8beed55b5a4c283dc2a33e2024108&redirect_uri=http://13.125.195.239:8080/oauth/redirect&response_type=code">
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
