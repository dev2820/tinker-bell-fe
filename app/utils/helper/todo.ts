import { Todo } from "@/types/todo";

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
