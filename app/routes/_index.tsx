import { TodoCheckbox } from "@/components/todo/TodoCheckbox";
import { TodoTitleInput } from "@/components/todo/TodoTitleInput";
import { useTodo } from "@/hooks/use-todo";
import { Todo } from "@/types/todo";
import { authAPI, isHTTPError } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Trash2Icon } from "lucide-react";
import { useState, MouseEvent, useMemo, ChangeEvent } from "react";
import * as todoAPI from "@/utils/api/todo";

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

import { Drawer, Button, IconButton } from "terra-design-system/react";
import { isFailed } from "@/utils/is";
export default function Index() {
  const { todos: defaultTodos } = useLoaderData<typeof loader>() as {
    todos: Todo[];
    loadFailed: boolean;
  };

  const {
    allTodos,
    completedTodos,
    incompletedTodos,
    updateTodoById,
    toggleTodoCompleteById,
    deleteTodoById,
    setTodos,
  } = useTodo(defaultTodos);
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
    toggleTodoCompleteById(todoId);
    todoAPI.updateTodoComplete({
      id: todoId,
      isCompleted: !isCompleted,
    });
    // update server too
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
      isCompleted: !isCompleted,
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
    await todoAPI.createTodo({
      title: title,
    });
    const req = await todoAPI.fetchTodos();
    if (isFailed(req)) {
      return;
    }

    setTodos([...req.value]);
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
  return (
    <main className="flex flex-col w-full h-screen items-stretch">
      <h2>Todo</h2>
      <ul className="flex-1 overflow-y-scroll p-4">
        {incompletedTodos.map((todo) => (
          <li key={todo.id} className="mb-4">
            <div className="gap-2 flex flex-row h-12 shadow-md bg-white rounded-md px-4">
              <TodoCheckbox
                data-todo-id={todo.id}
                checked={todo.isCompleted}
                onChange={handleChangeTodoComplete}
                className="flex-none"
                size="md"
              />
              <button
                className="flex-1 h-full text-left"
                data-todo-id={todo.id}
                onClick={handleClickTodoItem}
              >
                {todo.title}
              </button>
            </div>
          </li>
        ))}
        <li>
          <Drawer.Root variant="bottom">
            <Drawer.Trigger asChild>
              <Button className="w-full" theme="primary" size="lg">
                + 할 일 추가하기
              </Button>
            </Drawer.Trigger>
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
        </li>
      </ul>
      <ul className="flex-1 overflow-y-scroll p-4">
        {completedTodos.map((todo) => (
          <li key={todo.id} className="mb-4">
            <div className="gap-2 flex flex-row h-12 shadow-md bg-white rounded-md px-4">
              <TodoCheckbox
                data-todo-id={todo.id}
                checked={todo.isCompleted}
                onChange={handleChangeTodoComplete}
                className="flex-none"
                size="md"
              />
              <button
                className="flex-1 h-full text-left"
                data-todo-id={todo.id}
                onClick={handleClickTodoItem}
              >
                {todo.title}
              </button>
            </div>
          </li>
        ))}
      </ul>
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
              <Drawer.Title>
                <div className="flex flex-row gap-2 place-items-center">
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
                    className="flex-1"
                    placeholder="할 일을 입력해주세요"
                  />
                  <IconButton
                    size="md"
                    variant="ghost"
                    onClick={handleClickDeleteCurrentTodo}
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
