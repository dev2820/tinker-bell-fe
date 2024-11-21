import { cx } from "@/utils/cx";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

export function TodoTitleTextarea(props: TextareaAutosizeProps) {
  const { className, ...rest } = props;

  return (
    <TextareaAutosize
      className={cx(
        "focus:outline-none bg-white text-black text-lg",
        className
      )}
      minRows={1}
      {...rest}
    />
  );
}
