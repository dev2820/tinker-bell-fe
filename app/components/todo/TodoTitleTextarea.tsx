import { cn } from "@/utils/cn";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

export function TodoTitleTextarea(props: TextareaAutosizeProps) {
  const { className, ...rest } = props;

  return (
    <TextareaAutosize
      className={cn(
        "resize-none rounded-md p-2 border text-md focus:border-primary outline-primary border-gray-300 bg-transparent",
        className
      )}
      minRows={1}
      maxRows={3}
      {...rest}
    />
  );
}
