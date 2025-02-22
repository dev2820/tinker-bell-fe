import { cn } from "@/utils/cn";
import {
  ColorPicker as _ColorPicker,
  Input,
  type ColorPickerProps,
} from "terra-design-system/react";

export function ColorPicker(props: ColorPickerProps["Root"]) {
  return (
    <_ColorPicker.Root {...props}>
      <_ColorPicker.Context>
        {(api) => (
          <>
            <_ColorPicker.Control>
              <_ColorPicker.Trigger asChild>
                <button className="w-full flex flex-row gap-2 place-items-center py-2">
                  <_ColorPicker.Swatch
                    className="rounded-full size-5"
                    value={api.value}
                  />
                  <span className="select-none">
                    {api.value.toString("hex")}
                  </span>
                </button>
              </_ColorPicker.Trigger>
            </_ColorPicker.Control>
            <_ColorPicker.Positioner>
              <_ColorPicker.Content>
                <div className="trds-flex trds-flex-col trds-gap-3">
                  <_ColorPicker.Area>
                    <_ColorPicker.AreaBackground />
                    <_ColorPicker.AreaThumb />
                  </_ColorPicker.Area>
                  <div className="trds-flex trds-flex-row trds-gap-3">
                    <div
                      className={cn(
                        "trds-flex trds-flex-col trds-gap-2 trds-flex-1"
                      )}
                    >
                      <_ColorPicker.ChannelSlider channel="hue">
                        <_ColorPicker.ChannelSliderTrack />
                        <_ColorPicker.ChannelSliderThumb />
                      </_ColorPicker.ChannelSlider>
                    </div>
                  </div>
                  <div className="trds-flex trds-gap-2 trds-flex-1">
                    <_ColorPicker.ChannelInput
                      channel="hex"
                      className="w-full"
                      asChild
                    >
                      <Input />
                    </_ColorPicker.ChannelInput>
                  </div>
                  <div className="trds-flex trds-flex-col trds-gap-1.5">
                    <_ColorPicker.SwatchGroup>
                      {presets.map((color, id) => (
                        <_ColorPicker.SwatchTrigger key={id} value={color}>
                          <_ColorPicker.Swatch value={color} />
                        </_ColorPicker.SwatchTrigger>
                      ))}
                    </_ColorPicker.SwatchGroup>
                  </div>
                </div>
              </_ColorPicker.Content>
            </_ColorPicker.Positioner>
          </>
        )}
      </_ColorPicker.Context>
    </_ColorPicker.Root>
  );
}
// 💪 운동
const presets = [
  "hsl(10, 81%, 59%)",
  "hsl(60, 81%, 59%)",
  "hsl(100, 81%, 59%)",
  "hsl(175, 81%, 59%)",
  "hsl(190, 81%, 59%)",
  "hsl(205, 81%, 59%)",
  "hsl(220, 81%, 59%)",
  "hsl(250, 81%, 59%)",
  "hsl(280, 81%, 59%)",
  "hsl(350, 81%, 59%)",
];
