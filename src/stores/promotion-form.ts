import type { Promotion } from "@/types/promotion";
import { type StateCreator } from "zustand";

export type PromotionFormSlice = {
  promotion: Promotion;
  resetForm: () => void;
  setTitle: (title: Promotion["title"]) => void;
  setTotal: (title: Promotion["participants"]["total"]) => void;
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
});

export default createPromotionFormSlice;

const createDefaultPromotion = () => ({
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
