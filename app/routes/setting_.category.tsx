import { routerBack } from "@/utils/helper/app";
import { useNavigate } from "@remix-run/react";

import { ChevronLeft } from "lucide-react";

export default function Category() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    routerBack(navigate);
  };

  return (
    <main className="h-screen w-full">
      <header className="h-header relative px-4 text-center border-b">
        <button className="absolute left-4 top-3" onClick={handleGoBack}>
          <ChevronLeft size={32} strokeWidth={1} />
        </button>
        <span className="text-xl my-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold">
          카테고리
        </span>
      </header>
      <div className="h-[calc(100%_-_64px)] px-4 py-4">카테고리 추가 예정</div>
    </main>
  );
}
