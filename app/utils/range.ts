/**
 * 지정된 시작, 끝, 그리고 단계(step) 값을 기준으로 숫자 배열을 생성하는 함수입니다.
 * @param start - 배열의 시작 값입니다.
 * @param end - 배열의 끝 값입니다.
 * @param step - 각 단계의 증가 값입니다. 기본값은 1입니다.
 * @returns - 지정된 범위에 따른 숫자 배열입니다.
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];

  if (step === 0) {
    throw new Error("Step cannot be 0.");
  }

  const ascending = start < end;

  if (ascending) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else {
    for (let i = start; i > end; i -= step) {
      result.push(i);
    }
  }

  return result;
}
