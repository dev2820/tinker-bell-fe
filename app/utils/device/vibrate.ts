const createVibrate = (duration: number) => {
  return () => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };
};
export const vibrateShort = createVibrate(30);
export const vibrateMideum = createVibrate(50);
export const vibrateLong = createVibrate(100);
