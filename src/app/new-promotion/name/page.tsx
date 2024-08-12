// app/blog/[id]/page.js
"use client";

import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { ArrowLeftIcon } from "lucide-react";

import { text } from "@/utils/styles/patterns";
import { Input } from "@/components/ui/input";
import { cx } from "@/utils/styles/cx";
import { useBoundStore, useStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { pick } from "@/utils/object";
import { ChangeEventHandler, useEffect, useState } from "react";
import { isEmptyStr } from "@/utils/type-guard";
import { useRouter } from "next/navigation";

export default function NewPromotionNamePage() {
  const router = useRouter();
  const store = useStore(
    useBoundStore,
    useShallow((state) => pick(state, ["promotion", "setTitle"]))
  );

  const [newTitle, setNewTitle] = useState<string>(
    store?.promotion.title ?? ""
  );
  /**
   * TODO: Global Store를 이용해 form 입력을 처리하지만, global일 이유는 아니기 때문에 context를 이용하도록 바꿔야한다.
   * 혹은 jotai 이용?
   */

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value;
    setNewTitle(value);
  };

  const handleClickNextStep = () => {
    /**
     * 입력된 이름이 있다면 그 이름으로 promotion을 set하고 넘어간다.
     * 입력된 이름이 없다면 넘기지 않는다. (에러 처리가 필요할 듯 함)
     * set을 완료했다면 다음 페이지로 넘겨준다.
     */
    if (isEmptyStr(newTitle)) {
      /**
       * TODO: Empty Input Handling
       */
      return;
    }

    store?.setTitle(newTitle);
    router.push("/new-promotion/num-of-people");
  };

  useEffect(() => {
    if (store) {
      setNewTitle(store.promotion.title);
    }
  }, [store]);

  const handleGoBack = () => {
    router.replace("/");
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
          행사 제목을 입력해주세요
        </h2>
        <Input
          placeholder="행사 이름"
          value={newTitle}
          onChange={handleTitleChange}
        />
      </section>
      <CTAButton onClick={handleClickNextStep}>행사 제목 입력 완료</CTAButton>
    </main>
  );
}
