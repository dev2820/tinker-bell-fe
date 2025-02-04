import { cn } from "@/utils/cn";
import { ComponentProps } from "react";
import { Button } from "terra-design-system/react";

type TodoLoadMoreProps = ComponentProps<"div"> & {
  onClickLoadMore: () => void;
};
export function TodoLoadMore(props: TodoLoadMoreProps) {
  const { onClickLoadMore, className, ...rest } = props;

  const handleClickLoadMore = () => {
    onClickLoadMore();
  };

  return (
    <div
      className={cn(
        "h-full overflow-y-auto flex flex-col items-center justify-center",
        className
      )}
      {...rest}
    >
      <p className="text-center mb-8">
        다음 날짜의 Todo를 불러오려면 아래 &apos;더 불러오기&apos; 버튼을
        눌러주세요.
      </p>
      <Button theme="primary" onClick={handleClickLoadMore}>
        더 불러오기
      </Button>
    </div>
  );
}
