export function getRandomHexColor(): `#${string}` {
  const randomInt = Math.floor(Math.random() * 0xffffff);
  // 정수를 16진수로 변환하고 6자리로 패딩
  return `#${randomInt.toString(16).padStart(6, "0")}`;
}

export function stringToRGB(rgbStr: `#${string}`) {
  const rgb = rgbStr.slice(1);
  const r = rgb.slice(0, 2);
  const g = rgb.slice(2, 4);
  const b = rgb.slice(4, 6);

  return [Number(`0x${r}`), Number(`0x${g}`), Number(`0x${b}`)];
}
export function getTextColorBasedOnBackground(r: number, g: number, b: number) {
  // 명도를 계산하기 위해 RGB 값을 [0, 1] 범위로 변환

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 명도가 낮으면 흰색 텍스트, 높으면 검은색 텍스트 반환
  return luminance > 0.5 ? "black" : "white";
}

// 예시: RGB 값이 (255, 255, 255)인 경우
console.log(getTextColorBasedOnBackground(255, 255, 255)); // 'black'
console.log(getTextColorBasedOnBackground(0, 0, 0)); // 'white'
