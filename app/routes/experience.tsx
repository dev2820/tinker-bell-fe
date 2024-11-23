import { stackRouterBack } from "@/utils/helper/app";
import { useNavigate } from "@remix-run/react";
import { ChevronLeftIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { Button, IconButton } from "terra-design-system/react";

export default function Experience() {
  const navigate = useNavigate();

  const [showGuide, setShowGuide] = useState<boolean>(true);

  const handleClickBack = () => {
    stackRouterBack(navigate);
  };
  const handleClickStart = () => {
    setShowGuide(false);
  };
  const handleClickLogin = () => {
    stackRouterBack(navigate);
  };
  return (
    <div className="min-h-screen relative">
      {showGuide && (
        <Guide
          onClickBack={handleClickBack}
          onClickStart={handleClickStart}
          onClickLogin={handleClickLogin}
        />
      )}
      {!showGuide && <ExperienceView />}
    </div>
  );
}

function Guide({
  onClickBack,
  onClickStart,
  onClickLogin,
}: {
  onClickBack: () => void;
  onClickStart: () => void;
  onClickLogin: () => void;
}) {
  /**
   * 체험하기에 앞서
   * 주의사항: 당신이 만든 Todo는 저장되지 않는다.
   * - 바로 로그인하기
   * - 체험 시작
   *
   */

  return (
    <main className="h-screen w-full">
      <header className="relative h-header px-4">
        <IconButton
          variant="ghost"
          onClick={onClickBack}
          className="absolute top-1/2 -translate-y-1/2"
        >
          <ChevronLeftIcon size={24} />
        </IconButton>
      </header>
      <div className="h-[calc(100%_-_112px)] w-full px-4">
        <h2 className="text-2xl pt-24 mb-4">
          <TriangleAlertIcon size={24} className="inline-block text-warning" />{" "}
          체험하기에선 작업이 저장되지 않습니다
        </h2>
        <p>
          체험하기에선 작업물이 저장되지 않습니다. 체험하기를 나가는 순간
          작업물은 사라집니다. <br />
          또한 체험하기를 시작해도 언제든 회원가입으로 전환할 수 있습니다.
        </p>
      </div>
      <footer className="flex flex-row gap-2 relative h-footer px-4">
        <Button onClick={onClickLogin} variant="outline" className="flex-1">
          로그인하러 가기
        </Button>
        <Button
          onClick={onClickStart}
          variant="filled"
          theme="primary"
          className="flex-1"
        >
          시작
        </Button>
      </footer>
    </main>
  );
}

function ExperienceView() {
  return <></>;
}
