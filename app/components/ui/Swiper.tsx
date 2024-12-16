/**
 * TODO:
 * 가로 swipe이 가능해야한다.
 * 현재 index를 받으며 index에 해당하는 화면, 좌 우로는 다음 index에 해당하는 화면을 그린다.
 * virtual swipe을 기본 제공한다.
 * onChange, onChangeStart, onChangeEnd를 제공한다.
 *
 * *useDrag를 이용해야한다.
 */

import { clamp } from "@/utils/clamp";
import { cx } from "@/utils/cx";
import { useSpring, config, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type SwiperContextState = {
  width: number;
  isDragging: boolean;
  changeIsDragging: (state: boolean) => void;
};

const SwiperContext = createContext<SwiperContextState>({
  width: 0,
  isDragging: false,
  changeIsDragging: () => {},
});

type SwiperProps = {
  className?: string;
  width: number;
  children: ReactNode;
  onChange: (direct: -1 | 1) => void;
};

export function Swiper(props: SwiperProps) {
  const { children, width, onChange } = props;
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handlePrev = () => {
    onChange(-1);
  };
  const handleNext = () => {
    onChange(+1);
  };
  const changeIsDragging = (state: boolean) => {
    setIsDragging(state);
  };

  return (
    <SwiperContext.Provider value={{ width, isDragging, changeIsDragging }}>
      <SwiperContainer width={width} onPrev={handlePrev} onNext={handleNext}>
        {children}
      </SwiperContainer>
    </SwiperContext.Provider>
  );
}

type SwiperContainerProps = ComponentProps<"div"> & {
  width: number;
  onNext: () => void;
  onPrev: () => void;
};
function SwiperContainer(props: SwiperContainerProps) {
  const { className, children, width, onNext, onPrev, ...rest } = props;
  const { isDragging, changeIsDragging } = useContext(SwiperContext);
  /**
   * useDrag 사용
   */
  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: { tension: 10, friction: 26, mass: 0.3 },
    onRest: (result) => {
      if (result.finished) {
        if (x.get() > width - 70 && !isDragging) {
          onPrev();
          api.start({ x: 0, immediate: true });
        } else if (x.get() < -width + 70 && !isDragging) {
          onNext();
          api.start({ x: 0, immediate: true });
        }
      }
    },
  }));

  const next = () => {
    api.start({
      x: width,
      immediate: false,
      config: config.stiff,
    });
  };
  const prev = () => {
    api.start({
      x: -width,
      immediate: false,
      config: config.stiff,
    });
  };
  const reset = () => {
    api.start({
      x: 0,
      immediate: false,
      config: config.wobbly,
    });
  };

  const bind = useDrag(
    ({ last, offset: [ox], distance: [distX], cancel }) => {
      if (last) {
        if (distX > width * 0.3) {
          ox > 0 ? next() : prev();
          cancel();
        } else {
          reset();
        }
        changeIsDragging(false);
      } else {
        changeIsDragging(true);
        api.start({
          x: clamp(ox, -width, width),
          immediate: true,
        });
      }
    },
    {
      from: () => [0, x.get()],
      filterTaps: true,
      rubberband: true,
      axis: "x",
    }
  );

  return (
    <div
      className={cx("h-full", className)}
      style={{ width: `${width}px` }}
      {...rest}
    >
      <animated.div
        {...bind()}
        className="relative h-full flex"
        style={{ x: x, width: width * 3, touchAction: "none" }}
      >
        {children}
      </animated.div>
    </div>
  );
}

type SwiperItemProps = ComponentProps<"div"> & { index: number };
export function SwiperItem(props: SwiperItemProps) {
  const { index, className, children, ...rest } = props;
  const { width } = useContext(SwiperContext);

  return (
    <div
      className={cx("inline-block absolute top-0", className)}
      style={{
        width: `${width}px`,
        left: `${index * width}px`,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
