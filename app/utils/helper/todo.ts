import { Todo } from "@/types/todo";
import { RawTodo } from "../api/todo";

export const isTargetDateTodo = (todo: Todo, targetDate: Date) => {
  return (
    todo.date.year === targetDate.getFullYear() &&
    todo.date.month === targetDate.getMonth() + 1 &&
    todo.date.day === targetDate.getDate()
  );
};

export const delayNextDay = (todo: Todo) => {
  const dateObj = new Date(
    todo.date.year,
    todo.date.month - 1,
    todo.date.day + 1
  );

  return {
    ...todo,
    date: {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
    },
  };
};

export const delayNextWeek = (todo: Todo) => {
  const dateObj = new Date(
    todo.date.year,
    todo.date.month - 1,
    todo.date.day + 7
  );

  return {
    ...todo,
    date: {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
    },
  };
};

export const changeDateOfTodo = (todo: Todo, date: Date) => {
  return {
    ...todo,
    date: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    },
  };
};

export const getDateFromTodo = (todo: Todo) => {
  return new Date(todo.date.year, todo.date.month - 1, todo.date.day);
};

export const isSameDateTodo = (todo1: Todo, todo2: Todo) => {
  if (todo1.date.day !== todo2.date.day) return false;
  if (todo1.date.month !== todo2.date.month) return false;
  if (todo1.date.year !== todo2.date.year) return false;
  return true;
};

export const isSameTodo = (todo1: Todo, todo2: Todo) => {
  if (todo1.id !== todo2.id) return false;
  if (todo1.isCompleted !== todo2.isCompleted) return false;
  if (!isSameDateTodo(todo1, todo2)) return false;
  if (todo1.order !== todo2.order) return false;
  if (todo1.title !== todo2.title) return false;

  return true;
};

export const isThatDateTodo = (todo: Todo, date: Date) => {
  if (todo.date.year !== date.getFullYear()) return false;
  if (todo.date.month !== date.getMonth() + 1) return false;
  if (todo.date.day !== date.getDate()) return false;

  return true;
};

export const toTodo = (rawTodo: RawTodo): Todo => {
  const date = new Date(rawTodo.date);

  return {
    ...rawTodo,
    date: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    },
    description: rawTodo.description ?? "",
  };
};

export const getDefaultTodo = (): Todo => {
  return {
    id: -1,
    title: "",
    date: {
      year: 1970,
      month: 1,
      day: 1,
    },
    description: "",
    order: -1,
    isCompleted: false,
  };
};
