// app/blog/[id]/page.js
import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { text } from "@/utils/styles/patterns";
import { Input } from "@/components/ui/input";
import { cx } from "@/utils/styles/cx";

export default async function NewPromotion() {
  return (
    <main className="flex flex-col items-stretch">
      <Header
        leading={
          <Link href="/">
            <ArrowLeftIcon size={24} />
          </Link>
        }
      ></Header>
      <section className="my-8">
        <h2 className={cx(text.title1({ weight: "bold" }), "my-8")}>
          행사 제목을 입력해주세요
        </h2>
        <Input placeholder="행사 이름" />
      </section>
      <Link href="/new-promotion/num-of-people">
        <CTAButton>행사 제목 입력 완료</CTAButton>
      </Link>
    </main>
  );
}
