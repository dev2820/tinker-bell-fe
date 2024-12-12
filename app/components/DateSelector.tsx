import { ComponentProps } from "react";

import { useDrag } from "@use-gesture/react";
import { useSpring, animated, config } from "@react-spring/web";
import { clamp } from "@/utils/clamp";

const height = 200;

type DateSelectorProps = ComponentProps<"div"> & {
  currentDate: Date;
  onChangeDate?: (newDate: Date) => void;
};
export function DateSelector(props: DateSelectorProps) {
  const [{ h }, api] = useSpring(() => ({
    h: height,
    config: { tension: 10, friction: 26, mass: 0.3 },
  }));

  const open = ({ canceled }: { canceled: boolean }) => {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    api.start({
      h: 50,
      immediate: false,
      config: canceled ? config.wobbly : config.stiff,
    });
  };
  const close = (velocity = 0) => {
    api.start({
      h: height,
      immediate: false,
      config: { ...config.stiff, velocity },
    });
  };

  const bind = useDrag(
    ({
      last,
      velocity: [, vh],
      direction: [, dh],
      offset: [, oh],
      cancel,
      canceled,
    }) => {
      if (oh < -70) cancel();

      if (last) {
        oh > height * 0.5 || (vh > 0.5 && dh > 0)
          ? close(vh)
          : open({ canceled });
      } else {
        api.start({ h: clamp(oh, 50, 200), immediate: true });
      }
    },
    {
      from: () => [0, h.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );
  return (
    <animated.div
      {...bind()}
      style={{ height: h, touchAction: "none", background: "red" }}
    >
      Hello
    </animated.div>
  );
}
