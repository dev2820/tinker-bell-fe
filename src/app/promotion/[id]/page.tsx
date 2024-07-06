// app/blog/[id]/page.js
import { CTAButton } from "@/app/components/cta-button";
import { Header } from "@/app/components/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Promotion } from "@/types/promotion";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date-time";
import Link from "next/link";

import promotionData from "@/__mocks__/promotion";
import { WaitingItem } from "@/app/components/waiting-item";
import { Waiting } from "@/types/waiting";

async function fetchPromotion(id: string): Promise<Promotion> {
  // 여기에 데이터 패칭 로직을 추가합니다.
  // 예를 들어, API 호출을 통해 데이터를 가져옵니다.
  const res = await Promise.resolve(
    JSON.stringify(promotionData.find((d) => d.id === id))
  );

  const data = JSON.parse(res);
  return {
    ...data,
    duration: {
      start: new Date(data.duration.start),
      end: new Date(data.duration.end),
    },
    waitings: (data.waitings as Waiting[]).map((w) => ({
      ...w,
      time: new Date(w.time),
    })),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const promotion = await fetchPromotion(id);

  if (!promotion) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-stretch">
      <Header
        leading={
          <Link href="/">
            <ArrowLeftIcon size={24} />
          </Link>
        }
        trailing={
          <Button variant="link" className="text-neutral-300">
            이 행사를 취소할래요
          </Button>
        }
      ></Header>

      <section className="my-8">
        <Card>
          <CardHeader>
            <CardTitle
              className="
            text-neutral-400"
            >
              행사 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold leading-snug text-black mb-4">
              {promotion.title}
            </div>
            <div className="flex flex-row justify-between mb-2">
              <span>기간</span>
              <b>{`${formatDate(
                promotion.duration.start,
                "yyyy.MM.dd"
              )} ~ ${formatDate(promotion.duration.end, "yyyy.MM.dd")}`}</b>
            </div>
            <div className="flex flex-row justify-between mb-4">
              <span>참여 인원 수</span>
              <b>{`${promotion.participants.current} / ${promotion.participants.total}`}</b>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-neutral-400">웨이팅 일정</CardTitle>
            <Button
              variant="link"
              className="p-0 text-lg font-bold leading-snug h-auto"
            >
              날짜 및 시간 수정하기
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {promotion.waitings.map((w) => (
              <WaitingItem waiting={w} key={w.time.getTime()} />
            ))}
          </CardContent>
        </Card>
      </section>
      <CTAButton>웨이팅 등록 시작하기</CTAButton>
    </main>
  );
}
