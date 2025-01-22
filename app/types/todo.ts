import { Category, RawCategory } from "./category";

export type RawTodo = {
  id: number;
  title: string;
  date: string;
  isCompleted: boolean;
  order: number;
  description: string | null;
  categoryIdList: RawCategory["id"][];
};

export type Todo = {
  id: number;
  title: string;
  date: {
    year: number;
    month: number;
    day: number;
  };
  isCompleted: boolean;
  order: number;
  description: string;
  categoryIdList: Category["id"][];
};

// todo: date를 분해할 것 -> 년월일만 저장하도록, toTodo는 한국 시간으로 컨버팅해서
