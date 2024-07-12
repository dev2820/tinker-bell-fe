import { Header } from "@/app/components/header";
import { XIcon } from "lucide-react";
import Link from "next/link";

import { cx } from "@/utils/styles/cx";
import { text } from "@/utils/styles/patterns";
import { SettingMenuItem } from "@/app/settings/components/setting-menu-item";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  return (
    <main className="flex gap-8 flex-col items-stretch">
      <Header
        leading={
          <Link href="/settings">
            <XIcon size={24} />
          </Link>
        }
      >
        <span
          className={cx(text.title2({ weight: "bold" }), "text-neutral-400")}
        >
          개인 정보 설정
        </span>
      </Header>
      <div className="flex flex-col gap-4">
        <SettingMenuItem>로그아웃</SettingMenuItem>
      </div>
      <footer>
        <button
          className={cx(
            text.body({
              weight: "medium",
              className: "text-neutral-300",
            }),
            "fixed bottom-8 left-6"
          )}
        >
          서비스 탈퇴하기
        </button>
      </footer>
    </main>
  );
}
