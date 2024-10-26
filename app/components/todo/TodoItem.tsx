import { ChangeEventHandler, ComponentProps, MouseEventHandler } from "react";
import { Todo } from "@/types/todo";
import { cx } from "@/utils/cx";
import { CheckIcon } from "lucide-react";
import { cva } from "class-variance-authority";

export type TodoItemProps = ComponentProps<"div"> & {
  todo: Todo;
  onChangeComplete?: ChangeEventHandler<HTMLDivElement>;
  onClickTodo?: MouseEventHandler<HTMLButtonElement>;
};
export function TodoItem(props: TodoItemProps) {
  const { todo, className, onChangeComplete, onClickTodo, ...rest } = props;
  return (
    <div
      className="gap-2 flex flex-row h-12 shadow-md bg-white rounded-md px-4"
      {...rest}
    >
      <label
        className={cx(
          "inline-flex place-items-center justify-center",
          className
        )}
      >
        <input
          type="checkbox"
          className={cx("peer hidden")}
          data-todo-id={todo.id}
          checked={todo.isCompleted}
          onChange={onChangeComplete}
        />
        <div className={cx(todoCheckboxStyle({ size: "md" }))}>
          <CheckIcon
            size={14}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          />
        </div>
      </label>
      <button
        className="flex-1 h-full text-left"
        data-todo-id={todo.id}
        onClick={onClickTodo}
      >
        {todo.title}
      </button>
    </div>
  );
}

const todoCheckboxStyle = cva(
  [
    "relative",
    "rounded-full",
    "border border-gray-400 peer-checked:border-primary",
    "text-transparent peer-checked:text-primary-foreground",
    "peer-checked:bg-primary",
  ],
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
