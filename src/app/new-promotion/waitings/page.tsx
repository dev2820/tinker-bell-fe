"use client";

import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { text } from "@/utils/styles/patterns";
import { cx } from "@/utils/styles/cx";
import { Card } from "@/components/ui/card";
import { EditWaitingItem } from "@/app/components/edit-waiting-item";
import type { Waiting } from "@/types/waiting";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBoundStore, useStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { pick } from "@/utils/object";
import { isNil } from "@/utils/type-guard";

export default function NewPromotionWaitingsPage() {
  const router = useRouter();
  const store = useStore(
    useBoundStore,
    useShallow((state) => pick(state, ["promotion", "addEmptyWaiting"]))
  );
  const waitings = useMemo(() => {
    return store?.promotion.waitings ?? [];
  }, [store?.promotion]);

  const handleAddWaiting = () => {
    /**
     * TODO: waiting 추가
     */
    if (isNil(store)) {
      return;
    }

    const totalWaitings = store.promotion.waitings.length;
    router.push(`/new-promotion/waitings/${totalWaitings}`);
    store.addEmptyWaiting();
  };

  const handleGoBack = () => {
    router.replace("/new-promotion/num-of-people");
  };

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
        <h2 className={cx(text.title1({ weight: "bold" }), "my-8")}>
          웨이팅 정보를 입력해주세요
        </h2>
        <Card className="p-4 flex flex-col gap-4">
          <button
            className={cx(
              "h-16 w-full",
              "flex flex-row place-items-center justify-center gap-1",
              "border-2 border-dashed rounded-lg",
              "bg-neutral-50 text-neutral-300"
            )}
            onClick={handleAddWaiting}
          >
            <PlusIcon size={16} />
            <span>새로운 행사 추가하기</span>
          </button>
          {waitings.map((w) => (
            <EditWaitingItem waiting={w} key={w.time.toString()} />
          ))}
        </Card>
      </section>
      <CTAButton>웨이팅 정보 입력 완료</CTAButton>
    </main>
  );
}
