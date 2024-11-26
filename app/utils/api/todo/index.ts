import { Failed, Success } from "@/types/monad";
import { Todo } from "@/types/todo";
import { authAPI } from "..";
import Cookies from "js-cookie";
import { lastDayOfMonth } from "date-fns";

export type RawTodo = {
  id: number;
  title: string;
  date: string;
  isCompleted: boolean;
  order: number;
};

export async function fetchMonthTodos(year: number, month: number) {
  const startDate = new Date(year, month);
  const endDate = lastDayOfMonth(startDate);
  try {
    const result = await authAPI
      .get(`todos?from=${toDateStr(startDate)}&to=${toDateStr(endDate)}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .json<RawTodo[]>();
    return {
      isFailed: false,
      value: result.map((rawTodo) => toTodo(rawTodo)),
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
export async function fetchTodos(date: Date) {
  try {
    const result = await authAPI
      .get(`todos?from=${toDateStr(date)}&to=${toDateStr(date)}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })
      .json<RawTodo[]>();
    return {
      isFailed: false,
      value: result.map((rawTodo) => toTodo(rawTodo)),
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
  const { title, date } = payload;
  const isoDate = toISODate(date);
  try {
    const result = await authAPI
      .post(`todos`, {
        body: JSON.stringify({
          title: title,
          date: isoDate,
        }),
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
  const { id, title, date, isCompleted } = payload;
  try {
    await authAPI.put(`todos/${id}`, {
      body: JSON.stringify({
        title: title,
        date: date && toISODate(date),
        isCompleted: isCompleted,
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

type UpdateTodoCompletePayload = Pick<Todo, "id" | "isCompleted">;
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

type UpdateTodoOrderPayload = {
  orderList: Pick<Todo, "id" | "order">[];
};
export async function updateTodoOrder(payload: UpdateTodoOrderPayload) {
  const { orderList } = payload;
  try {
    await authAPI.put(`todos/orders`, {
      body: JSON.stringify({
        orderList: orderList,
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

export const toTodo = (rawTodo: RawTodo): Todo => {
  const date = new Date(rawTodo.date);

  return {
    ...rawTodo,
    date: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    },
  };
};

const toISODate = (date: Todo["date"]) => {
  return new Date(
    `${String(date.year).padStart(2, "0")}-${String(date.month).padStart(
      2,
      "0"
    )}-${String(date.day).padStart(2, "0")}T00:00:00.000Z`
  );
};

const toDateStr = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
