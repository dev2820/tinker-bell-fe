import { authAPI, isHTTPError } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { SettingsIcon, CalendarDaysIcon, ListChecksIcon } from "lucide-react";
import { toTodo, type RawTodo } from "@/utils/api/todo";
import { Button } from "terra-design-system/react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ToastProvider } from "@/contexts/toast";
import { stackRouterPush } from "@/utils/helper/app";
import { IconWithLabel } from "@/components/menubar/IconWithLabel";
import { TodoDailyView } from "@/components/views/TodoDailyView";
import { AddTodoDrawer } from "@/components/drawer/AddTodoDrawer";
import { TodoDetailDrawer } from "@/components/drawer/TodoDetailDrawer";
import { toCookieStorage, toRawCookie } from "@/utils/cookie";
import { Menubar } from "@/components/menubar/Menubar";
import { MenubarItem } from "@/components/menubar/MenubarItem";

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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      return await authAPI
        .get<RawTodo[]>("todos", {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        })
        .json()
        .then((rawTodos) => {
          return rawTodos.map((rawTodo) => toTodo(rawTodo));
        });
    },
    initialData: [],
  });

  return json({ dehydratedState: dehydrate(queryClient), accessToken });
};

export default function Index() {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <HydrationBoundary state={dehydratedState}>
      <ToastProvider>
        <TodoPage />
      </ToastProvider>
    </HydrationBoundary>
  );
}

function TodoPage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col w-full h-screen items-stretch">
      <TodoDailyView className="h-[calc(100%_-_72px)]" />
      <Menubar>
        <MenubarItem>
          <Link to={"/"} prefetch="render">
            <Button className="w-full h-full my-auto" variant="ghost">
              <IconWithLabel labelText="오늘의 할 일">
                <ListChecksIcon size={24} />
              </IconWithLabel>
            </Button>
          </Link>
        </MenubarItem>
        <MenubarItem>
          <Link to={"/calendar"} prefetch="render">
            <Button className="w-full h-full my-auto" variant="ghost">
              <IconWithLabel labelText="이달의 할 일">
                <CalendarDaysIcon size={24} />
              </IconWithLabel>
            </Button>
          </Link>
        </MenubarItem>
        <MenubarItem>
          <Button
            className="w-full h-full my-auto"
            variant="ghost"
            onClick={() => stackRouterPush(navigate, "/setting")}
          >
            <IconWithLabel labelText="설정">
              <SettingsIcon size={24} />
            </IconWithLabel>
          </Button>
        </MenubarItem>
      </Menubar>
      <AddTodoDrawer />
      <TodoDetailDrawer />
    </main>
  );
}
