import { create, type StateCreator } from "zustand";

export type CounterSlice = {
  count: number;
  increase: () => void;
  decrease: () => void;
};

const createCounterSlice: StateCreator<CounterSlice> = (set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
});

export default createCounterSlice;
