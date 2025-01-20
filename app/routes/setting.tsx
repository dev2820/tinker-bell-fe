import { clearAppCookie, routerBack } from "@/utils/helper/app";
import { useNavigate } from "@remix-run/react";
import { ChevronLeft } from "lucide-react";
import { deleteCookie } from "@/utils/cookie/client";
import { Button } from "terra-design-system/react";
import * as AuthAPI from "@/utils/api/auth";
export default function Setting() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    routerBack(navigate);
  };

  const handleClickLogout = async () => {
    await AuthAPI.logout();

    /**
     * FIXME: logout 고쳐지면 accessToken, refreshToken을 직접 지우는 코드는 제거
     */
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    clearAppCookie();
    navigate("/");
  };
  return (
    <main className="h-screen w-full">
      <header className="h-header relative px-4 text-center border-b">
        <button className="absolute left-4 top-3" onClick={handleGoBack}>
          <ChevronLeft size={32} strokeWidth={1} />
        </button>
        <span className="text-xl my-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold">
          설정
        </span>
      </header>
      <div className="h-[calc(100%_-_64px)] px-4 py-4">
        <Button onClick={handleClickLogout}>로그아웃</Button>
      </div>
    </main>
  );
}
