import { ChangeEventHandler, MouseEventHandler, useState } from "react";
import { Todo } from "@/types/todo";
import { cx } from "@/utils/cx";
import { EqualIcon } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { vibrateShort } from "@/utils/device/vibrate";

export type TodoItemProps = {
  todo: Todo;
  className?: string;
  onChangeComplete?: ChangeEventHandler<HTMLDivElement>;
  onClickTodo?: MouseEventHandler<HTMLButtonElement>;
};
export function TodoDraggableItem(props: TodoItemProps) {
  const { todo, className, onClickTodo } = props;
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
      whileDrag={{ scale: 1.02 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className={cx(
          "todo",
          "gap-2 flex flex-row min-h-12 border border-gray-200 bg-white rounded-lg px-4 my-2 items-start pb-[11px]",
          isDragging ? "shadow-md" : "",
          className
        )}
      >
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
        <div
          className="text-gray-300 opacity-50 cursor-grab flex-none pt-[11px]"
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: "none" }}
        >
          <EqualIcon size={24} />
        </div>
      </div>
    </Reorder.Item>
  );
}
