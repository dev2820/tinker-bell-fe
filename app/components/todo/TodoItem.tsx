import { ChangeEvent, ChangeEventHandler, MouseEventHandler } from "react";
import { Todo } from "@/types/todo";
import { cx } from "@/utils/cx";
import { CheckIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { vibrateShort } from "@/utils/device/vibrate";

export type TodoItemProps = {
  todo: Todo;
  className?: string;
  onChangeComplete?: ChangeEventHandler<HTMLDivElement>;
  onClickTodo?: MouseEventHandler<HTMLButtonElement>;
};
export function TodoItem(props: TodoItemProps) {
  const { todo, className, onChangeComplete, onClickTodo } = props;

  const handleChangeComplete = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeComplete?.(e);
    vibrateShort();
  };

  return (
    <div
      className={cx(
        "todo",
        "gap-2 flex flex-row min-h-12 border border-gray-200 bg-white rounded-lg px-4 my-2 items-start pb-[11px]",
        className
      )}
    >
      <label
        className={cx(
          "inline-flex place-items-center justify-center pt-[13px]"
        )}
      >
        <input
          type="checkbox"
          className={cx("peer hidden")}
          data-todo-id={todo.id}
          defaultChecked={todo.isCompleted}
          onChange={handleChangeComplete}
        />
        <div className={cx(todoCheckboxStyle({ size: "md" }))}>
          <CheckIcon
            size={14}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
          />
        </div>
      </label>
      <button
        className={cx(
          "flex-1 h-full text-left whitespace-pre-line select-none pt-[11px]",
          todo.isCompleted ? "line-through text-disabled" : ""
        )}
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
    "bg-transparent peer-checked:bg-primary",
    "transition-colors duration-200",
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
