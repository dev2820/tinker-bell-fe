// app/blog/[id]/page.js
import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { text } from "@/utils/styles/patterns";
import { InfoText } from "@/components/ui/info-text";
import { Input } from "@/components/ui/input";
import { cx } from "@/utils/styles/cx";

export default async function NewPromotionNumOfPeoplePage() {
  return (
    <main className="flex flex-col items-stretch">
      <Header
        leading={
          <Link href="/new-promotion/name">
            <ArrowLeftIcon size={24} />
          </Link>
        }
      ></Header>
      <section>
        <h2 className={cx(text.title1({ weight: "bold" }), "my-8")}>
          웨이팅할 인원 수를 입력해주세요
        </h2>
        <Input type="number" placeholder="인원수" className="mb-2" />
        <InfoText>최대 1000명까지 입력 가능해요</InfoText>
      </section>
      <Link href="/new-promotion/waiting">
        <CTAButton>인원 수 입력 완료</CTAButton>
      </Link>
    </main>
  );
}
