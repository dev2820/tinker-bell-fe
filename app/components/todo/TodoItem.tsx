import {
  ChangeEventHandler,
  ComponentProps,
  MouseEventHandler,
  useRef,
} from "react";
import { Todo } from "@/types/todo";
import { cx } from "@/utils/cx";
import { CheckIcon } from "lucide-react";
import { cva } from "class-variance-authority";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";

interface DragItem {
  index: number;
  id: string;
  type: string;
}
const ItemType = {
  TODO: "TODO",
};

export type TodoItemProps = ComponentProps<"div"> & {
  todo: Todo;
  index: number;
  onChangeComplete?: ChangeEventHandler<HTMLDivElement>;
  onClickTodo?: MouseEventHandler<HTMLButtonElement>;
  onMoveItem?: (dragIndex: number, hoverIndex: number) => void;
};
export function TodoItem(props: TodoItemProps) {
  const {
    todo,
    index,
    onChangeComplete,
    onClickTodo,
    onMoveItem,
    className,
    ...rest
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemType.TODO,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      if (!onMoveItem) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMoveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TODO,
    item: () => {
      return { id: todo.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      className={cx(
        "gap-2 flex flex-row h-12 shadow-md bg-white rounded-md px-4",
        isDragging ? "opacity-50" : "opacity-100",
        className
      )}
      ref={ref}
      data-handler-id={handlerId}
      {...rest}
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
