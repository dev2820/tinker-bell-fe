import { authAPI } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { CalendarIcon, SettingsIcon } from "lucide-react";
import { toTodo, type RawTodo } from "@/utils/api/todo";
import { Button } from "terra-design-system/react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ToastProvider } from "@/contexts/toast";
import { stackRouterPush } from "@/utils/helper/app";
import { MenubarItem } from "@/components/menubar/MenubarItem";
import { TodoDailyView } from "@/components/views/TodoDailyView";
import { AddTodoDrawer } from "@/components/drawer/AddTodoDrawer";
import { TodoDetailDrawer } from "@/components/drawer/TodoDetailDrawer";

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
  const cookie = new Map<string, string>(
    rawCookie
      .split("; ")
      .map(
        (cookieStr): Readonly<[string, string]> =>
          [...cookieStr.split("=", 2), ""].slice(0, 2) as [string, string]
      )
  );

  /**
   * TODO: accessToken 검사
   * accessToken 없음 -> refreshToken 삭제 후 로그인으로 (이상한 케이스)
   * accessToken 만료 -> refreshToken으로 accessToken 업데이트
   * refreshToken 만료 -> 로그인페이지로 이동
   * accessToken 사용시 refreshToken 업데이트? (고민좀)
   */
  const isLogined = cookie.has("accessToken");
  if (!isLogined) {
    return redirect("/login");
  }

  const accessToken = cookie.get("accessToken");
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

  const handleGoToday = () => {
    // setBaseDate(new Date());
    // swiperRef?.slideTo(initialSlideIndex, 200);
    // showToast({
    //   description: "오늘 날짜로 이동했어요",
    // });
  };

  return (
    <main className="flex flex-col w-full h-screen items-stretch">
      <TodoDailyView className="h-[calc(100%_-_72px)]" />
      <div className="z-10 h-menubar border-t border-gray-200 rounded-t-xl flex flex-row gap-2 place-items-stretch px-2 py-2">
        <Button
          className="w-full h-full my-auto"
          variant="ghost"
          onClick={handleGoToday}
        >
          <MenubarItem
            icon={<CalendarIcon size={24} />}
            labelText="오늘로 이동하기"
          />
        </Button>
        <Button
          className="w-full h-full my-auto"
          variant="ghost"
          onClick={() => stackRouterPush(navigate, "/setting")}
        >
          <MenubarItem icon={<SettingsIcon size={24} />} labelText="설정" />
        </Button>
      </div>
      <AddTodoDrawer />
      <TodoDetailDrawer />
    </main>
  );
}
