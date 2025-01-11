import type { RawTodo, Todo } from "@/types/todo";
import { authAPI } from "..";
import Cookies from "js-cookie";
import { lastDayOfMonth } from "date-fns";
import { KyResponse } from "ky";

export async function fetchTodos(startDate: Date, endDate: Date) {
  return await authAPI
    .get(`todos?from=${toDateStr(startDate)}&to=${toDateStr(endDate)}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    .json<{
      completedTodoList: RawTodo[];
      incompletedTodoList: RawTodo[];
    }>();
}
export async function fetchMonthTodos(year: number, month: number) {
  const startDate = new Date(year, month);
  const endDate = lastDayOfMonth(startDate);
  return await authAPI
    .get(`todos?from=${toDateStr(startDate)}&to=${toDateStr(endDate)}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    .json<{
      completedTodoList: RawTodo[];
      incompletedTodoList: RawTodo[];
    }>();
}

/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/getTodo
 */
export async function fetchTodosByDate(date: Date) {
  return await authAPI
    .get(`todos?from=${toDateStr(date)}&to=${toDateStr(date)}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    .json<{
      completedTodoList: RawTodo[];
      incompletedTodoList: RawTodo[];
    }>();
}

type DeleteTodoPayload = Pick<Todo, "id">;
export async function deleteTodo(payload: DeleteTodoPayload) {
  const { id } = payload;
  return await authAPI.delete(`todos/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
}

type CreateTodoPayload = Omit<Todo, "id" | "isCompleted">;
export async function createTodo(payload: CreateTodoPayload) {
  const { title, description, date } = payload;
  const isoDate = toISODate(date);
  const result = await authAPI
    .post(`todos`, {
      body: JSON.stringify({
        title: title,
        description: description,
        date: isoDate,
        categoryIdList: [],
      }),
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    .json<RawTodo>();

  return result;
}

type UpdateTodoPayload = Partial<Omit<Todo, "id">> & Pick<Todo, "id">;
export async function updateTodo(
  payload: UpdateTodoPayload
): Promise<KyResponse> {
  const { id, title, date, description, isCompleted } = payload;

  return authAPI.put(`todos/${id}`, {
    body: JSON.stringify({
      title: title,
      date: date && toISODate(date),
      isCompleted: isCompleted,
      description: description,
      categoryIdList: [],
    }),
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
}

type UpdateTodoCompletePayload = Pick<Todo, "id" | "isCompleted">;
export async function updateTodoComplete(payload: UpdateTodoCompletePayload) {
  const { id, ...rest } = payload;
  return await authAPI.patch(`todos/completion/${id}`, {
    body: JSON.stringify({
      ...rest,
    }),
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
}

type UpdateTodoOrderPayload = {
  orderList: Pick<Todo, "id" | "order">[];
};
export async function updateTodoOrder(payload: UpdateTodoOrderPayload) {
  const { orderList } = payload;
  return await authAPI.put(`todos/orders`, {
    body: JSON.stringify({
      orderList: orderList,
    }),
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
}

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
