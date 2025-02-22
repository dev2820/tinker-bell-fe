import { cn } from "@/utils/cn";
import { useCurrentDateStore } from "@/stores/current-date";
import { SettingsIcon } from "lucide-react";
import { ComponentProps } from "react";
import { IconButton } from "terra-design-system/react";
import { SettingDrawer } from "./drawer/SettingDrawer";

type CalendarAppHeaderProps = ComponentProps<"header">;
export function CalendarAppHeader(props: CalendarAppHeaderProps) {
  const { className, children, ...rest } = props;
  const { changeCurrentDate } = useCurrentDateStore();

  const today = new Date();

  const handleClickSetting = () => {
    // routerPush(navigate, "/setting");
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
      <SettingDrawer variant="left">
        <IconButton
          className="absolute left-4 top-3"
          variant="ghost"
          onClick={handleClickSetting}
        >
          <SettingsIcon size={24} />
        </IconButton>
      </SettingDrawer>
      <IconButton
        className="absolute right-4 top-4"
        variant="outline"
        size="xs"
        onClick={handleClickToday}
      >
        <span className="absolute">{today.getDate()}</span>
      </IconButton>
    </header>
  );
}
