import { Header } from "@/app/components/header";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { SettingMenuItem } from "@/app/settings/components/setting-menu-item";

export default function SettingsPage() {
  return (
    <main className="flex flex-col items-stretch">
      <Header
        leading={
          <Link href="/">
            <ArrowLeftIcon size={24} />
          </Link>
        }
      ></Header>
      <div className="flex flex-col gap-4 mt-8">
        <Link href="./settings/purchase-history" className="block">
          <SettingMenuItem>서비스 구매 내역</SettingMenuItem>
        </Link>
        <Link href="./settings/account" className="block">
          <SettingMenuItem>개인 정보 설정</SettingMenuItem>
        </Link>
      </div>
    </main>
  );
}
