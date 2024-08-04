"use client";

import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

import { text } from "@/utils/styles/patterns";
import { cx } from "@/utils/styles/cx";
import { Card } from "@/components/ui/card";
import { EditWaitingItem } from "@/app/components/edit-waiting-item";
import type { Waiting } from "@/types/waiting";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBoundStore, useStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { pick } from "@/utils/object";
import { isNil } from "@/utils/type-guard";
import { Button } from "@/components/ui/button";

export default function NewPromotionWaitingPage() {
  const router = useRouter();
  const store = useStore(
    useBoundStore,
    useShallow((state) => pick(state, ["promotion", "addEmptyWaiting"]))
  );

  const [waitingList] = useState<Waiting[]>([]);

  const handleAddWaiting = () => {
    /**
     * TODO: waiting 추가
     */
    if (isNil(store)) {
      return;
    }

    store.addEmptyWaiting();

    const totalWaitings = store.promotion.waitings.length;
    router.push(`/new-promotion/waitings/${totalWaitings}`);
  };

  const handleGoBack = () => {
    router.replace("/new-promotion/num-of-people");
  };

  const handleClickDeleteWaiting = () => {
    /**
     * TODO: 웨이팅 삭제 안내
     */
  };

  return (
    <main className="flex flex-col items-stretch">
      <Header
        leading={
          <button onClick={handleGoBack}>
            <ArrowLeftIcon size={24} />
          </button>
        }
        trailing={
          <Button variant={"link"} onClick={handleClickDeleteWaiting}>
            이 웨이팅을 삭제할래요
          </Button>
        }
      ></Header>
      <section className="flex flex-col"></section>
      <CTAButton>웨이팅 수정하기</CTAButton>
    </main>
  );
}
