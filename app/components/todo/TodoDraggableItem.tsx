import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { Todo } from "@/types/todo";
import { cx } from "@/utils/cx";
import { CheckIcon, EqualIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { Reorder, useDragControls } from "framer-motion";

export type TodoItemProps = {
  todo: Todo;
  index: number;
  onChangeComplete?: ChangeEventHandler<HTMLDivElement>;
  onClickTodo?: MouseEventHandler<HTMLButtonElement>;
  onMoveItem?: (dragIndex: number, hoverIndex: number) => void;
};
export function TodoDraggableItem(props: TodoItemProps) {
  const { todo, onChangeComplete, onClickTodo } = props;
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Item
      value={todo}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.05 }}
    >
      <div
        className={cx(
          "gap-2 flex flex-row h-12 border border-gray-200 bg-white rounded-md px-4 my-2 place-items-center",
          isDragging ? "shadow-md" : ""
        )}
      >
        <label className={cx("inline-flex place-items-center justify-center")}>
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
          className={cx(
            "flex-1 h-full text-left text-ellipsis overflow-hidden",
            todo.isCompleted ? "line-through text-disabled" : ""
          )}
          data-todo-id={todo.id}
          onClick={onClickTodo}
        >
          {todo.title}
        </button>
        <div
          className="text-gray-300 opacity-50 cursor-grab flex-none"
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: "none" }}
        >
          <EqualIcon size={24} />
        </div>
      </div>
    </Reorder.Item>
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