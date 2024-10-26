import { TodoCheckbox } from "@/components/todo/TodoCheckbox";
import { TodoTitleInput } from "@/components/todo/TodoTitleInput";
import { useTodo } from "@/hooks/use-todo";
import { Todo } from "@/types/todo";
import { authAPI, isHTTPError } from "@/utils/api";
import type { MetaFunction } from "@remix-run/node";
import { LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Trash2Icon } from "lucide-react";
import { useState, MouseEvent, useMemo, ChangeEvent, useCallback } from "react";
import * as todoAPI from "@/utils/api/todo";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

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
import { TodoItem } from "@/components/todo/TodoItem";
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
    moveTodo,
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
      isCompleted: isCompleted,
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
    await todoAPI.createTodo({
      title: title,
      date: new Date(),
    });
    const req = await todoAPI.fetchTodos();
    if (isFailed(req)) {
      return;
    }

    setTodos([...req.value]);
    setTitle("");
  };

  const handleMoveTodoItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      moveTodo(dragIndex, hoverIndex);
    },
    [moveTodo]
  );

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
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <div className="overflow-y-scroll p-4 flex-1">
          {incompletedTodos.map((todo, index) => (
            <TodoItem
              todo={todo}
              index={index}
              key={todo.id}
              className="mb-4"
              onChangeComplete={handleChangeTodoComplete}
              onClickTodo={handleClickTodoItem}
              onMoveItem={handleMoveTodoItem}
            />
          ))}
          <hr className="my-4" />
          {completedTodos.map((todo, index) => (
            <TodoItem
              todo={todo}
              index={index}
              className="mb-4"
              key={todo.id}
              onChangeComplete={handleChangeTodoComplete}
              onClickTodo={handleClickTodoItem}
              onMoveItem={handleMoveTodoItem}
            />
          ))}
        </div>
      </DndProvider>
      <Drawer.Root variant="bottom">
        <div className="p-4 flex-none">
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
