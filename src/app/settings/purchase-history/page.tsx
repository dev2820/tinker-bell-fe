import { Header } from "@/app/components/header";
import { ArrowLeftIcon, XIcon } from "lucide-react";
import Link from "next/link";

import { PurchaseHistory } from "./types/purchase-history";
import { PurchaseHistoryItem } from "./components/purchase-history-item";
import { cx } from "@/utils/styles/cx";
import { text } from "@/utils/styles/patterns";

async function fetchPurchaseHistory(): Promise<PurchaseHistory[]> {
  const res = await Promise.resolve<PurchaseHistory[]>([
    {
      id: "1",
      title: "구매 내역1",
      date: new Date("2024-11-02"),
    },
    {
      id: "2",
      title: "구매 내역2",
      date: new Date("2024-12-24"),
    },
    {
      id: "3",
      title: "구매 내역3",
      date: new Date("2024-05-02"),
    },
  ]);

  return res;
}

export default async function PurchaseHistoryPage() {
  const histories = await fetchPurchaseHistory();

  return (
    <main className="flex min-h-screen flex-col items-stretch">
      <Header
        leading={
          <Link href="/settings">
            <XIcon size={24} />
          </Link>
        }
      >
        <span
          className={cx(text.title2({ weight: "bold" }), "text-neutral-400")}
        >
          서비스 구매 내역
        </span>
      </Header>
      <div className="flex flex-col gap-4 mt-8">
        {histories.map((history) => (
          <Link
            href="./settings/purchase-history"
            className="block"
            key={history.id}
          >
            <PurchaseHistoryItem history={history}></PurchaseHistoryItem>
          </Link>
        ))}
      </div>
    </main>
  );
}
