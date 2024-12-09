import { authAPI, isHTTPError } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, useNavigate } from "@remix-run/react";
import {
  CalendarDaysIcon,
  ListChecksIcon,
  PlusIcon,
  SettingsIcon,
  TriangleAlertIcon,
  User2Icon,
} from "lucide-react";
import { Button } from "terra-design-system/react";

import { ToastProvider } from "@/contexts/toast";
import { routerPush } from "@/utils/helper/app";
import { IconWithLabel } from "@/components/tabbar/IconWithLabel";
import { AddTodoDrawer } from "@/components/drawer/AddTodoDrawer";
import { TodoDetailDrawer } from "@/components/drawer/TodoDetailDrawer";
import { toCookieStorage, toRawCookie } from "@/utils/cookie";
import { Tabbar } from "@/components/tabbar/Tabbar";
import { TodoCalendarView } from "@/components/views/TodoCalendarView";
import { TabItem } from "@/components/tabbar/TabItem";
import { cn } from "@/lib/utils";
import { RoundButton } from "@/components/ui/RoundButton";
import { useAddTodoDrawerStore } from "@/stores/add-todo-drawer";
import { useAlertStore } from "@/stores/alert-dialog";
import { AlertDialog } from "@/components/Dialog/AlertDialog";

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

export const loader: LoaderFunction = async ({ request }) => {
  const rawCookie = request.headers.get("Cookie") ?? "";
  const cookie = toCookieStorage(rawCookie);

  const accessToken = cookie.get("accessToken");
  const refreshToken = cookie.get("refreshToken");

  if (!accessToken || !refreshToken) {
    return redirect("/login");
  }

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
  return (
    <ToastProvider>
      <TodoCalendarPage />
    </ToastProvider>
  );
}

function TodoCalendarPage() {
  const navigate = useNavigate();
  const addTodoDrawer = useAddTodoDrawerStore();
  const alertDialog = useAlertStore();

  const handleClickPlusTodo = () => {
    addTodoDrawer.onOpen();
  };

  const handleClickProfile = () => {
    alertDialog.showAlert({
      title: (
        <span className="flex flex-row gap-2 place-items-center text-error">
          <TriangleAlertIcon size={24} />
          준비중인 기능입니다
        </span>
      ),
      description: "아직 준비중인 기능이에요. 조금만 기다려주세요",
    });
  };
  return (
    <main className="flex flex-col w-full h-screen items-stretch overflow-hidden">
      <TodoCalendarView className="h-[calc(100%_-_72px)]" />
      <Tabbar>
        <div className="flex-1 flex flex-row gap-2">
          <TabItem>
            <Button
              className={cn("w-full h-full my-auto")}
              variant="ghost"
              onClick={() => routerPush(navigate, "/")}
            >
              <IconWithLabel labelText="홈">
                <ListChecksIcon size={24} />
              </IconWithLabel>
            </Button>
          </TabItem>
          <TabItem>
            <Button
              className={cn("w-full h-full my-auto bg-gray-100")}
              variant="ghost"
              onClick={() => routerPush(navigate, "/calendar")}
            >
              <IconWithLabel labelText="달력">
                <CalendarDaysIcon size={24} />
              </IconWithLabel>
            </Button>
          </TabItem>
        </div>
        <div className="flex-none">
          <RoundButton
            className="-translate-y-10"
            onClick={handleClickPlusTodo}
          >
            <PlusIcon size={32} />
          </RoundButton>
        </div>
        <div className="flex-1 flex flex-row gap-2">
          <TabItem>
            <Button
              className="w-full h-full my-auto opacity-30"
              variant="ghost"
              onClick={handleClickProfile}
            >
              <IconWithLabel labelText="프로필">
                <User2Icon size={24} />
              </IconWithLabel>
            </Button>
          </TabItem>
          <TabItem>
            <Button
              className="w-full h-full my-auto"
              variant="ghost"
              onClick={() => routerPush(navigate, "/setting")}
            >
              <IconWithLabel labelText="설정">
                <SettingsIcon size={24} />
              </IconWithLabel>
            </Button>
          </TabItem>
        </div>
      </Tabbar>
      <AddTodoDrawer />
      <TodoDetailDrawer />
      <AlertDialog />
    </main>
  );
}
