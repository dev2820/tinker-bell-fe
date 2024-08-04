import { useState, useEffect } from "react";
import createPromotionFormSlice, {
  type PromotionFormSlice,
} from "./promotion-form";
import { create } from "zustand";

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

type BoundStoreSlice = PromotionFormSlice;
const useBoundStore = create<BoundStoreSlice>()((...a) => ({
  ...createPromotionFormSlice(...a),
}));

export { useBoundStore, useStore };

// import useStore from './useStore'
// import { useBoundStore } from './stores/useBoundStore'

// const count = useStore(useBoundStore, (state) => state.count)
