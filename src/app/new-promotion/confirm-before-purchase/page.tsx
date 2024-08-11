"use client";

import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon } from "lucide-react";

import { text } from "@/utils/styles/patterns";
import { cx } from "@/utils/styles/cx";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useBoundStore, useStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { pick } from "@/utils/object";
import { WaitingConfirmItem } from "@/app/components/waiting-confirm-item";

export default function NewPromotionConfirmBeforePurchasePage() {
  const router = useRouter();
  const store = useStore(
    useBoundStore,
    useShallow((state) => pick(state, ["promotion"]))
  );

  const handleGoBack = () => {
    router.replace("/new-promotion/num-of-people");
  };

  const handleClickCTAButton = () => {
    // 결제
    router.push(`/new-promotion/confirm-after-purchase`);
  };

  const title = store?.promotion.title;
  const totalParticipants = store?.promotion.participants.total;
  const allWaitings = store?.promotion.waitings;

  return (
    <main className="flex flex-col items-stretch">
      <Header
        leading={
          <button onClick={handleGoBack}>
            <ArrowLeftIcon size={24} />
          </button>
        }
      ></Header>
      <section>
        <h2
          className={cx(text.title1({ weight: "bold" }), "my-8 whitespace-pre")}
        >
          최종 결재 전,
          <br />
          입력한 행사 정보를 확인해주세요
        </h2>
        <Card className="p-4 flex flex-col gap-8">
          <div>
            <strong
              className={cx(
                text.title2({ weight: "bold" }),
                "text-primary mb-1"
              )}
            >
              행사 제목
            </strong>
            <p className={cx(text.body({ weight: "bold" }))}>{title}</p>
          </div>
          <div>
            <strong
              className={cx(
                text.title2({ weight: "bold" }),
                "text-primary mb-1"
              )}
            >
              총 웨이팅 인원 수
            </strong>
            <p className={cx(text.body({ weight: "bold" }))}>
              {totalParticipants}
            </p>
          </div>
          <div>
            <strong
              className={cx(
                text.title2({ weight: "bold" }),
                "text-primary mb-1"
              )}
            >
              웨이팅 목록
            </strong>
            <div>
              {allWaitings?.map((w, i) => (
                <WaitingConfirmItem waiting={w} key={i} />
              ))}
            </div>
          </div>
        </Card>
      </section>
      <CTAButton onClick={handleClickCTAButton}>결제하기</CTAButton>
    </main>
  );
}
