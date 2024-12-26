import { cn } from "@/lib/utils";
import { useCurrentDateStore } from "@/stores/current-date";
import { routerPush } from "@/utils/helper/app";
import { useNavigate } from "@remix-run/react";
import { SettingsIcon } from "lucide-react";
import { ComponentProps } from "react";
import { IconButton } from "terra-design-system/react";

type CalendarAppHeaderProps = ComponentProps<"header">;
export function CalendarAppHeader(props: CalendarAppHeaderProps) {
  const { className, children, ...rest } = props;
  const { changeCurrentDate } = useCurrentDateStore();
  const navigate = useNavigate();

  const today = new Date();

  const handleClickSetting = () => {
    routerPush(navigate, "/setting");
  };
  const handleClickToday = () => {
    changeCurrentDate(today);
  };

  return (
    <header
      className={cn(
        "w-full flex flex-row justify-center place-items-center relative",
        className
      )}
      {...rest}
    >
      {children}
      <IconButton
        className="absolute left-4 top-3"
        variant="ghost"
        onClick={handleClickSetting}
      >
        <SettingsIcon size={24} />
      </IconButton>
      <IconButton
        className="absolute right-4 top-3"
        variant="outline"
        size="sm"
        onClick={handleClickToday}
      >
        <span>{today.getDate()}</span>
      </IconButton>
    </header>
  );
}
