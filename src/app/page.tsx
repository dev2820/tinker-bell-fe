import Image from "next/image";
import { SettingsIcon } from "lucide-react"; // 톱니바퀴 아이콘 추가
import logo from "../../public/assets/images/logo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromotionItem } from "./components/promotion-item";
import { CTAButton } from "./components/cta-button";
import { Header } from "./components/header";
import Link from "next/link";
import promotionData from "@/__mocks__/promotion";

export default function Home() {
  const inProgressPromotions = promotionData.slice(0, 3);
  const readyPromotions = promotionData.slice(3);

  return (
    <main className="flex min-h-screen flex-col items-stretch">
      <Header
        leading={
          <>
            <Image src={logo} alt="Tinkerbell Logo" width={24} height={24} />
            <h1 className="ml-0.5 text-xl font-bold">Tinkerbell</h1>
          </>
        }
        trailing={
          <button>
            <SettingsIcon className="w-6 h-6" />
          </button>
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
      <CTAButton>새로운 행사 만들기</CTAButton>
    </main>
  );
}
