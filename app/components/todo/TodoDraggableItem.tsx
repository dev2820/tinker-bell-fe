import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEventHandler,
  useState,
} from "react";
import { Todo } from "@/types/todo";
import { cn } from "@/utils/cn";
import { CheckIcon, EqualIcon } from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { vibrateShort } from "@/utils/device/vibrate";
import { cva } from "class-variance-authority";
import { CategoryTag } from "../category/CategoryTag";

export type TodoDraggableItemProps = {
  todo: Todo;
  reorderMode: boolean;
  className?: string;
  onChangeComplete?: ChangeEventHandler<HTMLDivElement>;
  onClickTodo?: MouseEventHandler<HTMLButtonElement>;
};
export function TodoDraggableItem(props: TodoDraggableItemProps) {
  const { todo, className, reorderMode, onChangeComplete, onClickTodo } = props;
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
  const handleChangeComplete = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeComplete?.(e);
    vibrateShort();
  };

  return (
    <Reorder.Item
      value={todo}
      dragListener={false}
      dragControls={controls}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className={cn(
          "todo",
          "bg-layer-fill gap-2 flex flex-row min-h-12 border border-boundary rounded-lg px-4 my-2 items-start pb-[11px]",
          isDragging ? "shadow-md" : "",
          className
        )}
      >
        <div className="flex-1 flex flex-col h-full text-left whitespace-pre-line select-none pt-[11px]">
          <button
            className={cn("text-left")}
            data-todo-id={todo.id}
            onClick={onClickTodo}
          >
            <div
              className={todo.isCompleted ? "line-through text-disabled" : ""}
            >
              {todo.title}
            </div>
            {todo.categoryIdList.length > 0 && (
              <div className="flex flex-row gap-2 mt-1">
                <CategoryTag categoryId={todo.categoryIdList[0]} />
              </div>
            )}
          </button>
        </div>
        {reorderMode && (
          <div
            className="text-gray-300 opacity-50 cursor-grab flex-none pt-[11px]"
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
          >
            <EqualIcon size={24} />
          </div>
        )}
        {!reorderMode && (
          <label
            className={cn(
              "inline-flex place-items-center justify-center pt-[13px]"
            )}
          >
            <input
              type="checkbox"
              className={cn("peer hidden")}
              data-todo-id={todo.id}
              defaultChecked={todo.isCompleted}
              onChange={handleChangeComplete}
            />
            <div className={cn(todoCheckboxStyle({ size: "md" }), "mx-0.5")}>
              <CheckIcon
                size={14}
                className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
              />
            </div>
          </label>
        )}
      </div>
    </Reorder.Item>
  );
}

const todoCheckboxStyle = cva(
  [
    "relative",
    "rounded-full",
    "border border-gray-400 peer-checked:border-primary",
    "text-transparent peer-checked:text-primary-fg",
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
