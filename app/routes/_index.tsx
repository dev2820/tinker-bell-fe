import { TodoCheckbox } from "@/components/todo/TodoCheckbox";
import { TodoTitleInput } from "@/components/todo/TodoTitleInput";
import { useTodo } from "@/hooks/use-todo";
import { Todo } from "@/types/todo";
import { authAPI, isHTTPError } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from "lucide-react";
import { useState, MouseEvent, useMemo, ChangeEvent, useEffect } from "react";
import * as todoAPI from "@/utils/api/todo";
import { TodoDraggableItem } from "@/components/todo/TodoDraggableItem";
import { Drawer, Button, IconButton } from "terra-design-system/react";
import { isFailed } from "@/utils/is";
import { Reorder } from "framer-motion";
import { formatDate, formatKoreanDate } from "@/utils/date-time";
import { addDays, isSameDay, subDays } from "date-fns";

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
      .get<Todo[]>("todos", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      .json();

    return json({
      loadFailed: false,
      todos: req,
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

  const [today, setToday] = useState<Date>(new Date());
  const [todos, setTodos] = useState<Todo[]>(
    defaultTodos.filter((todo) => isSameDay(todo.date, today))
  );
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
  } = useTodo(todos);

  useEffect(() => {
    const updateTodos = async () => {
      // TODO: fetch today's todos
      const result = await todoAPI.fetchTodos();
      if (isFailed(result)) {
        // TODO: handle fetch failed
        return;
      }
      const newTodos = result.value.filter((todo) =>
        isSameDay(todo.date, today)
      );
      setTodos(newTodos);
    };
    updateTodos();
  }, [today]);
  const [currentTodoId, setCurrentTodoId] = useState<number>(-1);
  const currentTodo = useMemo<Todo | undefined>(() => {
    return allTodos.find((todo) => todo.id === currentTodoId);
  }, [currentTodoId, allTodos]);

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

    $target.classList.toggle("out-complete");
    setTimeout(() => {
      toggleTodoCompleteById(todoId);
      $target.classList.toggle("out-complete");
    }, 200);
  };
  const handleToggleCurrentTodoComplete = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentTodoId) {
      return;
    }

    const isCompleted = e.currentTarget.checked;
    toggleTodoCompleteById(currentTodoId);
    todoAPI.updateTodoComplete({
      id: currentTodoId,
      isCompleted: isCompleted,
    });
  };
  const handleClickTodoItem = (e: MouseEvent<HTMLButtonElement>) => {
    // show todo details
    const $target = e.currentTarget;
    const todoId = Number($target.dataset["todoId"]);
    setCurrentTodoId(todoId);
    setShowTodoDetails(true);
  };
  const handleClickDeleteCurrentTodo = () => {
    // show todo details
    if (currentTodoId) {
      deleteTodoById(currentTodoId);
      setShowTodoDetails(false);
      todoAPI.deleteTodo({ id: currentTodoId });
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  const handleUpdateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value;
    updateTodoById(currentTodoId, { title: newTitle });
  };

  const handleClickCreateTodo = async () => {
    const req = await todoAPI.createTodo({
      title: title,
      date: today,
    });
    if (isFailed(req)) {
      return;
    }

    addIncompletedTodo(req.value);
    setTitle("");
  };

  const handleExitDrawer = () => {
    // server update
    const currentTodo = allTodos.find((todo) => todo.id === currentTodoId);
    if (!currentTodo) {
      return;
    }

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

  return (
    <main className="flex flex-col w-full h-screen items-stretch">
      <h2 className="text-center mt-4">
        <small className="block">{today.getFullYear()}년</small>
        <div className="flex flex-row place-items-center justify-center gap-3">
          <button onClick={handleGotoPrevDate}>
            <ChevronLeftIcon size={28} strokeWidth={1} />
          </button>
          <time
            dateTime={formatDate(today, "yyyy-MM-dd")}
            className="font-bold w-36"
          >
            {formatKoreanDate(today, "MM월 dd일 (EEEE)")}
          </time>
          <button onClick={handleGotoNextDate}>
            <ChevronRightIcon size={28} strokeWidth={1} />
          </button>
        </div>
      </h2>
      <Reorder.Group
        axis="y"
        as="ul"
        values={incompletedTodos}
        onReorder={setIncompletedTodos}
        layoutScroll
        className="p-4 flex-1 overflow-y-scroll overflow-x-visible"
      >
        {incompletedTodos.map((todo) => (
          <TodoDraggableItem
            key={todo.id}
            todo={todo}
            onChangeComplete={handleChangeTodoComplete}
            onClickTodo={handleClickTodoItem}
          />
        ))}
      </Reorder.Group>
      <hr className="my-2 border-0" />
      <Drawer.Root variant="bottom">
        <div className="px-4 mb-4 flex-none">
          <Drawer.Trigger asChild>
            <Button className="w-full" theme="primary" size="lg">
              + 할 일 추가하기
            </Button>
          </Drawer.Trigger>
        </div>
        <Drawer.Content className="h-full min-h-96">
          <Drawer.Body>
            <div className="flex flex-row">
              <TodoTitleInput
                value={title}
                onChange={handleChangeTitle}
                className="flex-1"
                placeholder="할 일을 입력해주세요"
              />
              <Drawer.CloseTrigger asChild>
                <Button onClick={handleClickCreateTodo}>확인</Button>
              </Drawer.CloseTrigger>
            </div>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      <Drawer.Root variant="bottom">
        <div className="px-4 mb-4 flex-none">
          <Drawer.Trigger asChild>
            <Button className="w-full" theme="neutral" size="lg">
              완료된 작업 보기
            </Button>
          </Drawer.Trigger>
        </div>
        <Drawer.Content className="h-96">
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
              {completedTodos.map((todo) => (
                <TodoDraggableItem
                  key={todo.id}
                  todo={todo}
                  onChangeComplete={handleChangeTodoComplete}
                />
              ))}
            </Reorder.Group>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      <Drawer.Root
        variant="bottom"
        open={showTodoDetails}
        onExitComplete={handleExitDrawer}
        onInteractOutside={() => {
          setShowTodoDetails(false);
        }}
        trapFocus={false}
      >
        <Drawer.Content
          className="h-full min-h-96"
          onFocus={(e) => e.preventDefault()}
        >
          <Drawer.Header>
            {currentTodo && (
              <Drawer.Title className="w-full">
                <div className="flex flex-row place-items-center h-8">
                  <TodoCheckbox
                    onChange={handleToggleCurrentTodoComplete}
                    data-todo-id={currentTodo.id}
                    checked={currentTodo.isCompleted}
                    className="w-8 h-8 flex-none"
                    size="lg"
                  />
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
            )}
          </Drawer.Header>
        </Drawer.Content>
      </Drawer.Root>
    </main>
  );
}
