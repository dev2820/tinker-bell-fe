import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { Todo } from "@/types/todo";
import { cx } from "@/utils/cx";
import { CheckIcon, EqualIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { Reorder, useDragControls } from "framer-motion";
import { vibrateShort } from "@/utils/device/vibrate";

export type TodoItemProps = {
  todo: Todo;
  onChangeComplete?: ChangeEventHandler<HTMLDivElement>;
  onClickTodo?: MouseEventHandler<HTMLButtonElement>;
};
export function TodoDraggableItem(props: TodoItemProps) {
  const { todo, onChangeComplete, onClickTodo } = props;
  const controls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    vibrateShort();
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    vibrateShort();
  };
  return (
    <Reorder.Item
      value={todo}
      dragListener={false}
      dragControls={controls}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className={cx(
          "todo",
          "gap-2 flex flex-row h-12 border border-gray-200 bg-white rounded-lg px-4 my-2 place-items-center",
          isDragging ? "shadow-md" : ""
        )}
      >
        <label className={cx("inline-flex place-items-center justify-center")}>
          <input
            type="checkbox"
            className={cx("peer hidden")}
            data-todo-id={todo.id}
            defaultChecked={todo.isCompleted}
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
            "flex-1 h-full text-left text-ellipsis overflow-hidden whitespace-nowrap",
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
