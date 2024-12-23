import { cx } from "@/utils/cx";
import { forwardRef } from "react";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

export const TodoTitleTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(function (props: TextareaAutosizeProps, ref) {
  const { className, ...rest } = props;

  return (
    <TextareaAutosize
      className={cx(
        "resize-none rounded-md p-2 border bg-white text-md focus:border-primary outline-primary border-gray-300",
        className
      )}
      ref={ref}
      minRows={1}
      maxRows={3}
      {...rest}
    />
  );
});
TodoTitleTextarea.displayName = "TodoTitleTextarea";
