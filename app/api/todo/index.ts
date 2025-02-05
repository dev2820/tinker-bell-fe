import type { RawTodo, Todo } from "@/types/todo";
import { authAPI } from "..";
import Cookies from "js-cookie";
import { lastDayOfMonth } from "date-fns";
import { KyInstance, KyResponse } from "ky";

/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/getTodoList
 * @deprecated
 */
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
/**
 * TODO: api에 1대1 매치되도록 바꿀 것
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/getTodoList
 */
export async function fetchMonthTodos(
  client: KyInstance,
  year: number,
  month: number
) {
  const startDate = new Date(year, month);
  const endDate = lastDayOfMonth(startDate);
  return await client
    .get(`todos?from=${toDateStr(startDate)}&to=${toDateStr(endDate)}`)
    .json<{
      completedTodoList: RawTodo[];
      incompletedTodoList: RawTodo[];
    }>();
}

/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/getTodo
 */
export async function fetchTodosByDate(client: KyInstance, date: Date) {
  return await client
    .get(`todos?from=${toDateStr(date)}&to=${toDateStr(date)}`)
    .json<{
      completedTodoList: RawTodo[];
      incompletedTodoList: RawTodo[];
    }>();
}

export type DeleteTodoPayload = Pick<Todo, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/removeTodo
 */
export async function deleteTodo(
  client: KyInstance,
  payload: DeleteTodoPayload
) {
  const { id } = payload;
  return await client.delete(`todos/${id}`);
}

export type CreateTodoPayload = Omit<Todo, "id" | "isCompleted">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/saveTodo
 */
export async function createTodo(
  client: KyInstance,
  payload: CreateTodoPayload
) {
  const { title, description, categoryIdList, date } = payload;
  const isoDate = toISODate(date);
  const result = await client
    .post(`todos`, {
      body: JSON.stringify({
        title: title,
        description: description,
        date: isoDate,
        categoryIdList: categoryIdList,
      }),
    })
    .json<RawTodo>();

  return result;
}

export type UpdateTodoPayload = Partial<Omit<Todo, "id">> & Pick<Todo, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/changeTodo
 */
export async function updateTodo(
  client: KyInstance,
  payload: UpdateTodoPayload
): Promise<KyResponse> {
  const { id, title, date, description, categoryIdList, isCompleted } = payload;

  return client.put(`todos/${id}`, {
    body: JSON.stringify({
      title: title,
      date: date && toISODate(date),
      isCompleted: isCompleted,
      description: description,
      categoryIdList: categoryIdList,
    }),
  });
}

export type UpdateTodoCompletePayload = Pick<Todo, "id" | "isCompleted">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/changeTodoIsCompleted
 */
export async function updateTodoComplete(
  client: KyInstance,
  payload: UpdateTodoCompletePayload
) {
  const { id, ...rest } = payload;
  return await client.patch(`todos/completion/${id}`, {
    body: JSON.stringify({
      ...rest,
    }),
  });
}

export type UpdateTodoOrderPayload = {
  orderList: Pick<Todo, "id" | "order">[];
};
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/todo-controller/changeTodoOrder
 */
export async function updateTodoOrder(
  client: KyInstance,
  payload: UpdateTodoOrderPayload
) {
  const { orderList } = payload;
  return await client.put(`todos/orders`, {
    body: JSON.stringify({
      orderList: orderList,
    }),
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
