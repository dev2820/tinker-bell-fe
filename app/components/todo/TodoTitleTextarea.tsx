import { cx } from "@/utils/cx";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

export function TodoTitleTextarea(props: TextareaAutosizeProps) {
  const { className, ...rest } = props;

  return (
    <TextareaAutosize
      className={cx(
        "resize-none rounded-md p-2 border bg-white text-md focus:border-primary outline-primary border-gray-300",
        className
      )}
      minRows={1}
      maxRows={3}
      {...rest}
    />
  );
}
