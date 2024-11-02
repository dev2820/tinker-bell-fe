import { TodoTitleInput } from "@/components/todo/TodoTitleInput";
import { useTodo } from "@/hooks/use-todo";
import { Todo } from "@/types/todo";
import { authAPI, isHTTPError } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
} from "lucide-react";
import {
  useState,
  MouseEvent,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
} from "react";
import * as todoAPI from "@/utils/api/todo";
import { toTodo, type RawTodo } from "@/utils/api/todo";
import { TodoDraggableItem } from "@/components/todo/TodoDraggableItem";
import {
  Drawer,
  Button,
  IconButton,
  Portal,
  Dialog,
} from "terra-design-system/react";
import { isFailed } from "@/utils/is";
import { AnimatePresence, Reorder } from "framer-motion";
import {
  formatDate,
  formatKoreanDate,
  addDays,
  subDays,
  getToday,
} from "@/utils/date-time";
import { vibrateShort } from "@/utils/device/vibrate";
import Calendar from "@/components/calendar/Calendar";
import {
  changeDateOfTodo,
  delayNextDay,
  delayNextWeek,
  getDateFromTodo,
  isTargetDateTodo,
} from "@/utils/helper/todo";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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

  // 쿠키에 인증 정보가 없으면 로그인 페이지로 리다이렉트
  const isLogined = cookie.has("accessToken");
  if (!isLogined) {
    return redirect("/login");
  }

  const accessToken = cookie.get("accessToken");
  try {
    const req = await authAPI
      .get<RawTodo[]>("todos", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      .json();
    const timezone = "KR";

    return json({
      loadFailed: false,
      todos: req.map((rawTodo) => toTodo(rawTodo, timezone)),
    });
  } catch (err) {
    if (isHTTPError(err)) {
      console.log(err.request.headers);
      console.log(err.request.url);
    }
    // console.error(error);

    return json({
      loadFailed: true,
      todos: [],
    });
  }
};

export default function Index() {
  // TODO: 해당 날짜의 todo만 받을 수 있게 개선 필요
  const { todos: defaultTodos } = useLoaderData<typeof loader>() as {
    todos: Todo[];
    loadFailed: boolean;
  };

  const [today, setToday] = useState<Date>(getToday());
  const [todos, setTodos] = useState<Todo[]>(
    defaultTodos.filter((todo) => isTargetDateTodo(todo, today))
  );
  const [calendarDate, setCalendarDate] = useState<Date>(today);
  const {
    allTodos,
    completedTodos,
    incompletedTodos,
    updateTodoById,
    toggleTodoCompleteById,
    addIncompletedTodo,
    deleteTodoById,
    setIncompletedTodos,
    setCompletedTodos,
  } = useTodo(todos, today);

  useEffect(() => {
    const updateTodos = async () => {
      // TODO: fetch today's todos
      const result = await todoAPI.fetchTodos();
      if (isFailed(result)) {
        // TODO: handle fetch failed
        return;
      }
      const newTodos = result.value.filter((todo) =>
        isTargetDateTodo(todo, today)
      );
      setTodos(newTodos);
    };
    updateTodos();
  }, [today]);

  const [currentTodo, setCurrentTodo] = useState<Todo>({
    id: -1,
    title: "",
    date: {
      year: 1970,
      month: 1,
      day: 1,
    },
    isCompleted: false,
  });

  const [title, setTitle] = useState<string>("");
  const [showTodoDetails, setShowTodoDetails] = useState<boolean>(false);
  const handleChangeTodoComplete = (e: ChangeEvent<HTMLInputElement>) => {
    const $target = e.currentTarget;
    const isCompleted = e.currentTarget.checked;
    const todoId = Number($target.dataset["todoId"]);
    todoAPI.updateTodoComplete({
      id: todoId,
      isCompleted: isCompleted,
    });

    vibrateShort();
    toggleTodoCompleteById(todoId);
  };

  const handleClickTodoItem = (e: MouseEvent<HTMLButtonElement>) => {
    // show todo details
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);
    const todo = allTodos.find((todo) => todo.id === todoId);
    if (todo) {
      setCurrentTodo({ ...todo });
    }
    setShowTodoDetails(true);
  };
  const handleClickDeleteCurrentTodo = () => {
    // show todo details
    if (currentTodo) {
      deleteTodoById(currentTodo.id);
      setShowTodoDetails(false);
      todoAPI.deleteTodo({ id: currentTodo.id });
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const handleKeydownTitle = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const req = await todoAPI.createTodo({
        title: title,
        date: {
          year: today.getFullYear(),
          month: today.getMonth() + 1,
          day: today.getDate(),
        },
      });
      if (isFailed(req)) {
        return;
      }

      addIncompletedTodo(req.value);
      setTitle("");
    }
  };
  const handleUpdateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    if (currentTodo) {
      setCurrentTodo({
        ...currentTodo,
        title: newTitle,
      });
    }
  };
  // const handleUpdateDate = (dateStr: string) => {
  //   // dateStr = yyyy-MM-dd
  //   console.log(dateStr);
  //   const newDate = new Date(dateStr);
  //   if (currentTodo) {
  //     setCurrentTodo({
  //       ...currentTodo,
  //       date: newDate,
  //     });
  //   }
  // };

  const handleClickCreateTodo = async () => {
    const req = await todoAPI.createTodo({
      title: title,
      date: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
    });
    if (isFailed(req)) {
      return;
    }

    addIncompletedTodo(req.value);
    setTitle("");
  };

  const handleClickUpdateConfirm = () => {
    // server update
    setShowTodoDetails(false);

    updateTodoById(currentTodo.id, {
      ...currentTodo,
    });
    todoAPI.updateTodo({
      ...currentTodo,
    });
  };

  const handleGotoPrevDate = () => {
    setToday(subDays(today, 1));
  };

  const handleGotoNextDate = () => {
    setToday(addDays(today, 1));
  };

  const handleClickDelayTomorrow = () => {
    const delayedTodo = delayNextDay(currentTodo);
    setCurrentTodo({
      ...delayedTodo,
    });
    updateTodoById(currentTodo.id, {
      ...delayedTodo,
    });
    todoAPI.updateTodo({
      ...delayedTodo,
    });
    setShowTodoDetails(false);
  };

  const handleClickDelayWeek = () => {
    const delayedTodo = delayNextWeek(currentTodo);

    setCurrentTodo({
      ...delayedTodo,
    });
    updateTodoById(currentTodo.id, {
      ...delayedTodo,
    });
    todoAPI.updateTodo({
      ...delayedTodo,
    });
    setShowTodoDetails(false);
  };

  const handleUpdateCalendarDate = (dateStr: string) => {
    const newDate = new Date(dateStr);
    setCalendarDate(newDate);
  };

  const handleClickUpdateDateConfirm = () => {
    const changedTodo = changeDateOfTodo(currentTodo, calendarDate);
    if (currentTodo) {
      setCurrentTodo({
        ...changedTodo,
      });
      updateTodoById(currentTodo.id, {
        ...changedTodo,
      });
      todoAPI.updateTodo({
        ...changedTodo,
      });
      setShowTodoDetails(false);
    }
  };

  const handleClickCalendarIcon = () => {
    setCalendarDate(getDateFromTodo(currentTodo));
  };

  return (
    <main className="flex flex-col w-full h-screen items-stretch">
      <h2 className="text-center mt-4 mb-4">
        <small className="block">{formatKoreanDate(today, "MM월 dd일")}</small>
        <div className="flex flex-row place-items-center justify-center gap-3">
          <button onClick={handleGotoPrevDate}>
            <ChevronLeftIcon size={28} strokeWidth={1} />
          </button>
          <time
            dateTime={formatDate(today, "yyyy-MM-dd")}
            className="font-bold w-36"
          >
            {formatKoreanDate(today, "EEEE")}
          </time>
          <button onClick={handleGotoNextDate}>
            <ChevronRightIcon size={28} strokeWidth={1} />
          </button>
        </div>
      </h2>
      <div className="overflow-y-scroll">
        <Reorder.Group
          axis="y"
          as="ul"
          values={incompletedTodos}
          onReorder={setIncompletedTodos}
          layoutScroll
          className="px-4 overflow-y-hidden overflow-x-hidden"
        >
          <AnimatePresence>
            {incompletedTodos.map((todo) => (
              <TodoDraggableItem
                key={todo.id}
                todo={todo}
                onChangeComplete={handleChangeTodoComplete}
                onClickTodo={handleClickTodoItem}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
      {/**
       * todo 생성
       */}
      <Drawer.Root variant="bottom">
        <div className="px-4 mb-2 flex-none">
          <Drawer.Trigger asChild>
            <Button className="w-full" theme="primary" size="lg">
              + 할 일 추가하기
            </Button>
          </Drawer.Trigger>
        </div>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content className="h-full min-h-96 rounded-t-lg pt-4">
              <Drawer.Header className="h-full">
                <div className="flex flex-row">
                  <TodoTitleInput
                    value={title}
                    onChange={handleChangeTitle}
                    onKeyDown={handleKeydownTitle}
                    className="flex-1"
                    placeholder="할 일을 입력해주세요"
                  />
                </div>
              </Drawer.Header>
              <Drawer.Body></Drawer.Body>
              <Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <Button variant="outline" className="mr-3">
                    닫기
                  </Button>
                </Drawer.CloseTrigger>
                <Drawer.CloseTrigger asChild>
                  <Button theme="primary" onClick={handleClickCreateTodo}>
                    확인
                  </Button>
                </Drawer.CloseTrigger>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/**
       * 완료된 todo 보기
       */}
      <Drawer.Root variant="bottom">
        <div className="px-4 mb-4 flex-none">
          <Drawer.Trigger asChild>
            <Button className="w-full" theme="neutral" size="lg">
              완료된 작업 보기
            </Button>
          </Drawer.Trigger>
        </div>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content className="h-96 rounded-t-lg pt-4">
              <Drawer.Body>
                <div className="flex flex-row-reverse mb-2">
                  <Drawer.CloseTrigger asChild>
                    <Button>닫기</Button>
                  </Drawer.CloseTrigger>
                </div>
                <Reorder.Group
                  axis="y"
                  as="ul"
                  values={completedTodos}
                  onReorder={setCompletedTodos}
                  layoutScroll
                  className="p-4 overflow-y-scroll overflow-x-visible"
                >
                  <AnimatePresence>
                    {completedTodos.map((todo) => (
                      <TodoDraggableItem
                        key={todo.id}
                        todo={todo}
                        onChangeComplete={handleChangeTodoComplete}
                      />
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      {/**
       * todo 자세히 보기
       */}
      <Drawer.Root
        variant="bottom"
        open={showTodoDetails}
        onInteractOutside={() => {
          setShowTodoDetails(false);
        }}
        onEscapeKeyDown={() => {
          setShowTodoDetails(false);
        }}
        trapFocus={false}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content
              className="h-full min-h-96 rounded-t-lg pt-4"
              onFocus={(e) => e.preventDefault()}
            >
              <Drawer.Header>
                <Drawer.Title className="w-full">
                  <div className="flex flex-row place-items-center h-8">
                    <TodoTitleInput
                      value={currentTodo.title}
                      onChange={handleUpdateTitle}
                      className="w-full h-8 min-w-0"
                      placeholder="할 일을 입력해주세요"
                    />
                    <IconButton
                      size="md"
                      variant="ghost"
                      onClick={handleClickDeleteCurrentTodo}
                      className="flex-none "
                    >
                      <Trash2Icon size={24} />
                    </IconButton>
                  </div>
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Description>
                <section className="flex flex-row place-items-center gap-3 px-4">
                  <CalendarIcon size={24} />
                  <Dialog.Root>
                    {/* <Input type="date" onChange={handleUpdateDate} /> */}
                    {`${currentTodo.date.year}-${currentTodo.date.month
                      .toString()
                      .padStart(2, "0")}-${currentTodo.date.day
                      .toString()
                      .padStart(2, "0")}`}
                    <Dialog.Trigger asChild>
                      <IconButton size="sm" onClick={handleClickCalendarIcon}>
                        <CalendarIcon size={24} />
                      </IconButton>
                    </Dialog.Trigger>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content className="w-4/5 min-w-92 h-112 py-6 flex flex-col">
                        <Dialog.Title className="text-center flex-none px-4">
                          날짜 변경
                        </Dialog.Title>
                        <Dialog.Description className="flex-1 px-6">
                          <Calendar
                            today={calendarDate}
                            onSelect={handleUpdateCalendarDate}
                          />
                        </Dialog.Description>
                        <div className="flex flex-row-reverse flex-none px-6 gap-3">
                          <Dialog.CloseTrigger asChild>
                            <Button
                              theme="primary"
                              onClick={handleClickUpdateDateConfirm}
                            >
                              확인
                            </Button>
                          </Dialog.CloseTrigger>
                          <Dialog.CloseTrigger asChild>
                            <Button variant="outline" theme="neutral">
                              닫기
                            </Button>
                          </Dialog.CloseTrigger>
                        </div>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Dialog.Root>
                  <Button size="sm" onClick={handleClickDelayTomorrow}>
                    내일로
                  </Button>
                  <Button size="sm" onClick={handleClickDelayWeek}>
                    다음주로
                  </Button>
                </section>
              </Drawer.Description>
              <Drawer.Footer>
                <Button onClick={handleClickUpdateConfirm}>확인</Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </main>
  );
}
