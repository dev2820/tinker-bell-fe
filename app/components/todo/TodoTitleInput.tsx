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
        "resize-none focus:outline-none bg-white text-black text-lg",
        className
      )}
      ref={ref}
      minRows={2}
      maxRows={3}
      {...rest}
    />
  );
});
TodoTitleTextarea.displayName = "TodoTitleTextarea";
