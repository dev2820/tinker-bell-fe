import Image from "next/image";
import { SettingsIcon } from "lucide-react"; // 톱니바퀴 아이콘 추가
import logo from "../../public/assets/images/logo.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromotionItem } from "./components/promotion-item";
import { CTAButton } from "./components/cta-button";
import { Header } from "./components/header";

const mockData = [
  {
    id: "promo1",
    title: "Summer Sale",
    duration: {
      start: new Date("2024-06-01"),
      end: new Date("2024-06-30"),
    },
  },
  {
    id: "promo2",
    title: "Back to School",
    duration: {
      start: new Date("2024-08-15"),
      end: new Date("2024-09-15"),
    },
  },
  {
    id: "promo3",
    title: "Black Friday",
    duration: {
      start: new Date("2024-11-25"),
      end: new Date("2024-11-30"),
    },
  },
  {
    id: "promo4",
    title: "Holiday Discounts",
    duration: {
      start: new Date("2024-12-15"),
      end: new Date("2024-12-31"),
    },
  },
  {
    id: "promo5",
    title: "New Year Sale",
    duration: {
      start: new Date("2025-01-01"),
      end: new Date("2025-01-07"),
    },
  },
  {
    id: "promo6",
    title: "Spring Clearance",
    duration: {
      start: new Date("2025-03-01"),
      end: new Date("2025-03-31"),
    },
  },
];

export default function Home() {
  const inProgressPromotions = mockData.slice(0, 3);
  const readyPromotions = mockData.slice(3);

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
              <PromotionItem promotion={p} inProgress key={p.id} />
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
              <PromotionItem promotion={p} key={p.id} />
            ))}
          </CardContent>
        </Card>
      </section>
      <CTAButton>새로운 행사 만들기</CTAButton>
    </main>
  );
}
