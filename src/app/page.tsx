"use client";

import Image from "next/image";
import { SettingsIcon } from "lucide-react";
import logo from "../../public/assets/images/logo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromotionItem } from "./components/promotion-item";
import { CTAButton } from "./components/cta-button";
import { Header } from "./components/header";
import Link from "next/link";
import promotionData from "@/__mocks__/promotion";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/utils/api";

/**
 * login되어 있지 않다면 로그인 페이지로 튕겨야한다.
 * accessToken과 refreshToken은 cookie에서 가져온다.
 */

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  if (!accessToken) {
    router.push("/login");
  }

  useEffect(() => {
    (async () => {
      const events = await api
        .get("/events", {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        })
        .json();

      console.log(events);
    })();
  }, []);

  const inProgressPromotions = promotionData.slice(0, 3);
  const readyPromotions = promotionData.slice(3);

  return (
    <main className="flex flex-col items-stretch">
      <Header
        leading={
          <>
            <Image src={logo} alt="Tinkerbell Logo" height={24} />
          </>
        }
        trailing={
          <Link className="block" href="/settings">
            <SettingsIcon size={24} />
          </Link>
        }
      ></Header>
      <section className="my-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              지금 진행중인 행사가 있어요!
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inProgressPromotions.map((p) => (
              <Link href={`/promotion/${p.id}`} key={p.id}>
                <PromotionItem promotion={p} inProgress />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="">
        <Card>
          <CardHeader>
            <CardTitle className="text-neutral-400">진행 예정인 행사</CardTitle>
          </CardHeader>
          <CardContent>
            {readyPromotions.map((p) => (
              <Link href={`/promotion/${p.id}`} key={p.id}>
                <PromotionItem promotion={p} key={p.id} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
      {/**
       * !!TODO: Button형태 링크를 사용할 수 있게 buttonVariants를 만들 것
       */}
      <Link href="/new-promotion/name">
        <CTAButton>새로운 행사 만들기</CTAButton>
      </Link>
    </main>
  );
}
