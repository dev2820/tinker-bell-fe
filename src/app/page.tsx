import React, { type ComponentProps } from "react";
import Image from "next/image";
import { SettingsIcon } from "lucide-react"; // 톱니바퀴 아이콘 추가
import logo from "../../public/assets/images/logo.svg";
import { Spacer } from "@/components/ui/spacer";
import { cx } from "@/utils/cx";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header className={"w-full h-12"}></Header>
    </main>
  );
}

type HeaderProps = ComponentProps<"header">;
function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={cx("flex flex-row items-center text-neutral-300", className)}
      {...props}
    >
      <Image src={logo} alt="Logo" width={24} height={24} />
      <h1 className="ml-0.5 text-xl font-bold">Tinkerbell</h1>
      <Spacer />
      <button>
        <SettingsIcon className="w-6 h-6" />
      </button>
    </header>
  );
}
