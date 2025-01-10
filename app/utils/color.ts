export function getRandomHexColor(): `#${string}` {
  const randomInt = Math.floor(Math.random() * 0xffffff);
  // 정수를 16진수로 변환하고 6자리로 패딩
  return `#${randomInt.toString(16).padStart(6, "0")}`;
}
