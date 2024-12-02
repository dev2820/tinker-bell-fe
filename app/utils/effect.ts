// 버릴까 이거
import { PointerEvent } from "react";
/**
 * 이펙트용 함수 분리 및 CTA 버튼 적용
 */
export const addRippleEffect = (e: PointerEvent<HTMLButtonElement>) => {
  const ripple = document.createElement("span");

  // Add ripple class to span
  ripple.classList.add("animate-ripple");
  ripple.classList.add("absolute");
  ripple.classList.add("w-24");
  ripple.classList.add("h-24");
  ripple.classList.add("-ml-12");
  ripple.classList.add("-mt-12");
  ripple.classList.add("opacity-0");
  ripple.classList.add("bg-[rgba(0,0,0,0.3)]");

  // Add span to the button
  e.currentTarget.appendChild(ripple);

  // Get position of X
  const x = e.clientX - e.currentTarget.offsetLeft;

  // Get position of Y
  const y = e.clientY - e.currentTarget.offsetTop;

  // Position the span element
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  // Remove span after 0.3s
  setTimeout(() => {
    ripple.remove();
  }, 800);
};
