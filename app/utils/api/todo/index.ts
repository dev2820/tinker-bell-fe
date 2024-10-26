import { Failed, Success } from "@/types/monad";
import { Todo } from "@/types/todo";
import { authAPI } from "..";
import Cookies from "js-cookie";

type RawTodo = {
  id: number;
  title: string;
  date: string;
  isCompleted: boolean;
};

export async function fetchTodos() {
  try {
    const result = await authAPI
      .get("todos", {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .json<RawTodo[]>();
    return {
      isFailed: false,
      value: result.map(toTodo),
      error: null,
    } as Success<Todo[]>;
  } catch (err) {
    return {
      isFailed: true,
      value: null,
      error: err as Error,
    } as Failed<Error>;
  }
}

type FetchTodoPayload = Pick<Todo, "id">;
export async function fetchTodo(payload: FetchTodoPayload) {
  const { id } = payload;
  try {
    const result = await authAPI
      .get(`todos/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .json<RawTodo>();
    return {
      isFailed: false,
      value: toTodo(result),
      error: null,
    } as Success<Todo>;
  } catch (err) {
    return {
      isFailed: true,
      value: null,
      error: err as Error,
    } as Failed<Error>;
  }
}

type DeleteTodoPayload = Pick<Todo, "id">;
export async function deleteTodo(payload: DeleteTodoPayload) {
  const { id } = payload;
  try {
    await authAPI.delete(`todos/${id}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    return {
      isFailed: false,
      value: true,
      error: null,
    } as Success<boolean>;
  } catch (err) {
    return {
      isFailed: true,
      value: null,
      error: err as Error,
    } as Failed<Error>;
  }
}

type CreateTodoPayload = Omit<Todo, "id" | "isCompleted">;
export async function createTodo(payload: CreateTodoPayload) {
  try {
    const result = await authAPI
      .post(`todos`, {
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .json<RawTodo>();

    return {
      isFailed: false,
      value: toTodo(result),
      error: null,
    } as Success<Todo>;
  } catch (err) {
    return {
      isFailed: true,
      value: null,
      error: err as Error,
    } as Failed<Error>;
  }
}

type UpdateTodoPayload = Partial<Omit<Todo, "id">> & Pick<Todo, "id">;
export async function updateTodo(payload: UpdateTodoPayload) {
  const { id, ...rest } = payload;
  try {
    await authAPI.put(`todos/${id}`, {
      body: JSON.stringify({
        ...rest,
      }),
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    return {
      isFailed: false,
      value: true,
      error: null,
    } as Success<boolean>;
  } catch (err) {
    return {
      isFailed: true,
      value: null,
      error: err as Error,
    } as Failed<Error>;
  }
}

type UpdateTodoCompletePayload = Pick<Todo, "id"> & { isCompleted: boolean };
export async function updateTodoComplete(payload: UpdateTodoCompletePayload) {
  const { id, ...rest } = payload;
  try {
    await authAPI.patch(`todos/completion/${id}`, {
      body: JSON.stringify({
        ...rest,
      }),
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    return {
      isFailed: false,
      value: true,
      error: null,
    } as Success<boolean>;
  } catch (err) {
    return {
      isFailed: true,
      value: null,
      error: err as Error,
    } as Failed<Error>;
  }
}

const toTodo = (rawTodo: RawTodo): Todo => {
  return {
    ...rawTodo,
    date: new Date(rawTodo.date),
  };
};
