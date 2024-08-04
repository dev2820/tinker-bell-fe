import type { Promotion } from "@/types/promotion";
import { Waiting } from "@/types/waiting";
import { type StateCreator } from "zustand";

export type PromotionFormSlice = {
  promotion: Promotion;
  resetForm: () => void;
  setTitle: (title: Promotion["title"]) => void;
  setTotal: (title: Promotion["participants"]["total"]) => void;
  addEmptyWaiting: () => void;
  setWaiting: (index: number, newWaiting: Waiting) => void;
};

const createPromotionFormSlice: StateCreator<PromotionFormSlice> = (set) => ({
  promotion: createDefaultPromotion(),
  resetForm: () => set(() => ({ promotion: createDefaultPromotion() })),
  setTitle: (title) =>
    set((state) => ({ promotion: { ...state.promotion, title: title } })),
  setTotal: (total) =>
    set((state) => ({
      promotion: {
        ...state.promotion,
        participants: { ...state.promotion.participants, total: total },
      },
    })),
  addEmptyWaiting: () =>
    set((state) => ({
      promotion: {
        ...state.promotion,
        waitings: [...state.promotion.waitings, createDefaultWaiting()],
      },
    })),
  setWaiting: (index: number, waiting: Waiting) =>
    set((state) => ({
      promotion: {
        ...state.promotion,
        waitings: state.promotion.waitings.map((w, i) =>
          i === index ? waiting : w
        ),
      },
    })),
});

export default createPromotionFormSlice;

const createDefaultPromotion = (): Promotion => ({
  id: "",
  title: "",
  duration: {
    start: new Date(0),
    end: new Date(0),
  },
  participants: {
    current: 0,
    total: 0,
  },
  waitings: [],
});

const createDefaultWaiting = (): Waiting => ({
  time: new Date(0),
  participants: {
    current: 0,
    total: 0,
  },
  status: "planned",
});
