import { authAPI, isHTTPError } from "@/api";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/react";
import { ToastProvider } from "@/contexts/toast";
import { TodoDailyView } from "@/components/views/TodoDailyView";
import { AddTodoDrawer } from "@/components/drawer/AddTodoDrawer";
import { TodoDetailDrawer } from "@/components/drawer/TodoDetailDrawer";
import { toCookieStorage, toRawCookie } from "@/utils/cookie";
import { AlertDialog } from "@/components/Dialog/AlertDialog";
import { useCurrentDateStore } from "@/stores/current-date";
import { CalendarAppHeader } from "@/components/CalendarAppHeader";
import { PlusIcon } from "lucide-react";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { useModeStore } from "@/stores/mode";
import { useShallow } from "zustand/shallow";
import { CTAButton } from "@/components/ui/CTAButton";
import { cn } from "@/utils/cn";
import { useDailyTodos } from "@/hooks/use-daily-todos";
import { sendCookie } from "@/utils/helper/app";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Ticket bell todo" },
    {
      property: "og:title",
      content: "Ticket bell todo",
    },
    {
      name: "description",
      content: "세상에서 제일 쉬운 Todo",
    },
  ];
};

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

export const loader: LoaderFunction = async ({ request }) => {
  const rawCookie = request.headers.get("Cookie") ?? "";
  const cookie = toCookieStorage(rawCookie);

  /**
   * TODO: accessToken 검사
   * accessToken 없음 -> refreshToken 삭제 후 로그인으로 (이상한 케이스)
   * accessToken 만료 -> refreshToken으로 accessToken 업데이트
   * refreshToken 만료 -> 로그인페이지로 이동
   * accessToken 사용시 refreshToken 업데이트? (고민좀)
   */
  // const isLogined = cookie.has("accessToken");
  const accessToken = cookie.get("accessToken");
  const refreshToken = cookie.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return redirect("/login");
  }

  /**
   *
   */
  try {
    await authAPI.get("token/verify", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    if (isHTTPError(err)) {
      if (err.response.status === 403) {
        try {
          const { accessToken } = await authAPI
            .post<{ accessToken: string }>("token/renew", {
              body: JSON.stringify({
                refreshToken: refreshToken,
              }),
            })
            .json();

          cookie.set("accessToken", accessToken);

          return redirect("/", {
            headers: {
              "Set-Cookie": toRawCookie(cookie),
            },
          });
        } catch (err) {
          return redirect("/login");
        }
      }
    }
    return redirect("/login");
  }

  return json({});
};

export default function Index() {
  useEffect(() => {
    sendCookie();
  }, []);

  return (
    <ToastProvider>
      <TodoPage />
    </ToastProvider>
  );
}

function TodoPage() {
  const { currentDate } = useCurrentDateStore();
  const { commitReorderTodos } = useDailyTodos(currentDate);
  const { isReorderMode, offReorderMode } = useModeStore(
    useShallow((state) => ({
      isReorderMode: state.isReorderMode,
      offReorderMode: state.offReorderMode,
    }))
  );
  const addTodoDrawer = useAddTodoDrawerStore();

  const handleClickPlusTodo = () => {
    addTodoDrawer.onOpen();
  };

  const handleDoneReorder = () => {
    offReorderMode();
    commitReorderTodos();
  };

  return (
    <main className="flex flex-col w-full h-screen items-stretch overflow-hidden">
      <CalendarAppHeader className="h-[64px]"></CalendarAppHeader>
      <TodoDailyView className="h-[calc(100%_-_64px)]" />
      <CTAButton
        shape="round"
        className={cn(
          "fixed left-1/2 -translate-x-1/2 bottom-4 h-14 pr-6 transition translate-y-0",
          (isReorderMode || addTodoDrawer.isOpen) && "translate-y-64"
        )}
        onClick={handleClickPlusTodo}
        leftIcon={<PlusIcon size={20} />}
      >
        할 일 추가
      </CTAButton>
      <CTAButton
        theme="primary"
        variant="filled"
        size="lg"
        onClick={handleDoneReorder}
        className={cn(
          "fixed left-1/2 -translate-x-1/2 bottom-4 w-[calc(100%_-_32px)] h-14 transition",
          isReorderMode ? "translate-y-0" : "translate-y-64"
        )}
      >
        변경 완료
      </CTAButton>
      <AddTodoDrawer />
      <TodoDetailDrawer />
      <AlertDialog />
    </main>
  );
}
