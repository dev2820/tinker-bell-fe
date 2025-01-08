import { clearAppCookie, routerBack, routerPush } from "@/utils/helper/app";
import { Form, useNavigate } from "@remix-run/react";
import { ChevronLeft, LogOutIcon, TagIcon } from "lucide-react";
import { deleteCookie } from "@/utils/cookie/client";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { authAPI } from "@/utils/api";
import { toCookieStorage } from "@/utils/cookie";
import { ActionFunction, redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const rawCookie = request.headers.get("Cookie") ?? "";
  const cookie = toCookieStorage(rawCookie);
  const accessToken = cookie.get("accessToken");
  try {
    await authAPI.get("oauth/logout", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    // handle error
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": [
        "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax",
        "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax",
      ].join(", "),
    },
  });
};

export default function Setting() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    routerBack(navigate);
  };

  const handleClickLogout = async () => {
    clearAppCookie();
    // await AuthAPI.logout();

    /**
     * FIXME: logout 고쳐지면 accessToken, refreshToken을 직접 지우는 코드는 제거
     */
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    // navigate("/");
  };

  const handleClickCategoryMenu = () => {
    routerPush(navigate, "/setting/category");
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
      <div className="h-[calc(100%_-_64px)]">
        <menu>
          <li>
            <MenuItem
              onClick={handleClickCategoryMenu}
              icon={<TagIcon size={16} />}
            >
              카테고리
            </MenuItem>
          </li>
          <li>
            <Form method="post">
              <MenuItem
                onClick={handleClickLogout}
                type="submit"
                icon={<LogOutIcon size={16} />}
                className="text-error"
              >
                로그아웃
              </MenuItem>
            </Form>
          </li>
        </menu>
      </div>
    </main>
  );
}

type MenuItemProps = ComponentProps<"button"> & { icon: ReactNode };
const MenuItem = (props: MenuItemProps) => {
  const { children, icon, className, ...rest } = props;
  return (
    <button
      className={cn(
        className,
        "px-4 w-full h-12 text-start hover:bg-gray-100 active:bg-gray-200 duration-300 transition-colors border-b",
        "flex flex-row items-center gap-2"
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};
