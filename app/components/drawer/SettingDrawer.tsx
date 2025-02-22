import { MenuItem } from "@/components/MenuItem";
import { useThemeStore } from "@/stores/theme";
import { deleteCookie } from "@/utils/cookie/client";
import { clearAppCookie } from "@/utils/helper/app";
import { Form } from "@remix-run/react";
import { XIcon, TagIcon, MoonIcon, LogOutIcon } from "lucide-react";
import { Drawer, DrawerProps, IconButton } from "terra-design-system/react";

type SettingDrawerProps = Omit<DrawerProps["Root"], "className">;
export function SettingDrawer(props: SettingDrawerProps) {
  const { children, ...rest } = props;
  const { theme, toggleTheme } = useThemeStore();

  const handleClickCategoryMenu = () => {
    /**
     * 카테고리 보여주기 처리 필요
     */
  };
  const handleClickLogout = async () => {
    clearAppCookie();
    // await AuthAPI.logout();

    /**
     * FIXME: logout 고쳐지면 accessToken, refreshToken을 직접 지우는 코드는 제거
     */
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    // navigate("/");
  };

  const handleToggleDarkmode = () => {
    toggleTheme();
  };

  return (
    <Drawer.Root variant="left" {...rest}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content className="w-[380px] max-w-full rounded-r-2xl">
          <Drawer.Header>
            <Drawer.CloseTrigger className="absolute right-2 top-2" asChild>
              <IconButton variant="ghost">
                <XIcon size={24} />
              </IconButton>
            </Drawer.CloseTrigger>
            <Drawer.Title>설정</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <menu>
              <li>
                <MenuItem
                  onClick={handleClickCategoryMenu}
                  className="rounded-md"
                  icon={<TagIcon size={16} />}
                >
                  카테고리 관리
                </MenuItem>
              </li>
              <li>
                <MenuItem
                  onClick={handleToggleDarkmode}
                  className="rounded-md"
                  icon={<MoonIcon size={16} />}
                >
                  다크모드 <b>{theme === "dark" ? "ON" : "OFF"}</b>
                </MenuItem>
              </li>
              <li>
                <Form method="post">
                  <MenuItem
                    onClick={handleClickLogout}
                    type="submit"
                    icon={<LogOutIcon size={16} />}
                    className="text-error rounded-md"
                  >
                    로그아웃
                  </MenuItem>
                </Form>
              </li>
            </menu>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
