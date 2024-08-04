// app/blog/[id]/page.js
"use client";

import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { text } from "@/utils/styles/patterns";
import { InfoText } from "@/components/ui/info-text";
import { Input } from "@/components/ui/input";
import { cx } from "@/utils/styles/cx";
import { useRouter } from "next/navigation";
import { useBoundStore, useStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { pick } from "@/utils/object";
import { ChangeEventHandler, useEffect, useState } from "react";
import { isZero } from "@/utils/type-guard";

export default function NewPromotionNumOfPeoplePage() {
  const router = useRouter();
  const store = useStore(
    useBoundStore,
    useShallow((state) => pick(state, ["promotion", "setTotal"]))
  );

  const [newNumOfPeople, setNewNumOfPeople] = useState<number>(
    store?.promotion.participants.total ?? 0
  );

  const handleChangeNumOfPeople: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;
    setNewNumOfPeople(Number(value));
  };

  const handleClickNextStep = () => {
    /**
     * 입력된 이름이 있다면 그 이름으로 promotion을 set하고 넘어간다.
     * 입력된 이름이 없다면 넘기지 않는다. (에러 처리가 필요할 듯 함)
     * set을 완료했다면 다음 페이지로 넘겨준다.
     */
    if (isZero(newNumOfPeople)) {
      /**
       * TODO: Empty Input Handling
       */
      return;
    }

    store?.setTotal(newNumOfPeople);
    router.push("/new-promotion/waitings");
  };

  useEffect(() => {
    if (store) {
      setNewNumOfPeople(store.promotion.participants.total);
    }
  }, [store]);

  const handleGoBack = () => {
    router.replace("/new-promotion/name");
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
          웨이팅할 인원 수를 입력해주세요
        </h2>
        <Input
          type="number"
          placeholder="인원수"
          className="mb-2"
          value={newNumOfPeople}
          onChange={handleChangeNumOfPeople}
        />
        <InfoText>최대 1000명까지 입력 가능해요</InfoText>
      </section>
      <CTAButton onClick={handleClickNextStep}>인원 수 입력 완료</CTAButton>
    </main>
  );
}
