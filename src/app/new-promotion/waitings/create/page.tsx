"use client";

import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon } from "lucide-react";

import { ChangeEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBoundStore, useStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { pick } from "@/utils/object";
import { Button } from "@/components/ui/button";
import { text } from "@/utils/styles/patterns";
import { cx } from "@/utils/styles/cx";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/date-time";

export default function NewPromotionCreateWaitingPage() {
  const router = useRouter();
  const store = useStore(
    useBoundStore,
    useShallow((state) =>
      pick(state, ["promotion", "addWaiting", "deleteWaiting"])
    )
  );

  const [numOfPeopleStr, setNumOfPeopleStr] = useState<string>("0");
  const [startDateStr, setStartDateStr] = useState<string>(
    formatDate(new Date(), "yyyy-MM-dd")
  );
  const [startTimeStr, setStartTimeStr] = useState<string>(
    formatDate(new Date(), "HH:mm")
  );

  const handleGoBack = () => {
    router.replace("/new-promotion/waitings");
  };

  const handleClickDeleteWaiting = () => {
    router.push("/new-promotion/waitings");
  };

  const handleChangeStartDateStr: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.currentTarget.value;

    setStartDateStr(value);
  };

  const handleChangeStartTimeStr: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.currentTarget.value;

    setStartTimeStr(value as `${number}${number}:${number}${number}`);
  };

  const handleChangeNumOfPeople: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;

    setNumOfPeopleStr(value);
  };

  const handleClickSubmit = () => {
    if (!store) {
      return;
    }

    store.addWaiting({
      time: new Date(startDateStr + " " + startTimeStr),
      participants: {
        current: 0,
        total: parseInt(numOfPeopleStr, 10) ?? 0,
      },
      status: "planned",
    });
    router.push("/new-promotion/waitings");
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
      <form className="flex flex-col gap-4 mt-8">
        <div className="">
          <label className={cx(text.title2({ weight: "bold" }), "block mb-2")}>
            날짜
          </label>
          <Input
            type="date"
            value={startDateStr}
            onChange={handleChangeStartDateStr}
          />
        </div>
        <div className="">
          <label className={cx(text.title2({ weight: "bold" }), "block mb-2")}>
            시작 시간
          </label>
          <Input
            type="time"
            value={startTimeStr}
            onChange={handleChangeStartTimeStr}
          />
        </div>
        <div className="">
          <label className={cx(text.title2({ weight: "bold" }), "block mb-2")}>
            인원 수
          </label>
          <Input
            type="number"
            value={numOfPeopleStr}
            onChange={handleChangeNumOfPeople}
          />
        </div>
      </form>
      <CTAButton onClick={handleClickSubmit}>웨이팅 수정하기</CTAButton>
    </main>
  );
}
