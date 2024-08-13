import type { Promotion } from "@/types/promotion";
import { Waiting } from "@/types/waiting";
import { type StateCreator } from "zustand";

export type PromotionFormSlice = {
  promotion: Promotion;
  resetForm: () => void;
  setTitle: (title: Promotion["title"]) => void;
  setTotal: (title: Promotion["participants"]["total"]) => void;
  addWaiting: (waiting: Partial<Waiting>) => void;
  setWaiting: (index: number, newWaiting: Waiting) => void;
  deleteWaiting: (index: number) => void;
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
  addWaiting: (waiting) =>
    set((state) => ({
      promotion: {
        ...state.promotion,
        waitings: [
          ...state.promotion.waitings,
          { ...createDefaultWaiting(), ...waiting },
        ].toSorted((a, b) => (a.time.getTime() > b.time.getTime() ? 1 : -1)),
      },
    })),
  setWaiting: (index: number, waiting: Waiting) =>
    set((state) => ({
      promotion: {
        ...state.promotion,
        waitings: state.promotion.waitings
          .map((w, i) => (i === index ? waiting : w))
          .toSorted((a, b) => (a.time.getTime() > b.time.getTime() ? 1 : -1)),
      },
    })),
  deleteWaiting: (index: number) =>
    set((state) => ({
      promotion: {
        ...state.promotion,
        waitings: state.promotion.waitings.filter((_, i) => i !== index),
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
  time: new Date(),
  participants: {
    current: 0,
    total: 0,
  },
  status: "planned",
});
