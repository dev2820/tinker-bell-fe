import { useState, useEffect } from "react";
import createCounterSlice, { CounterSlice } from "./counter";
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

const useBoundStore = create<CounterSlice>()((...a) => ({
  ...createCounterSlice(...a),
}));

export { useBoundStore, useStore };

// import useStore from './useStore'
// import { useBoundStore } from './stores/useBoundStore'

// const count = useStore(useBoundStore, (state) => state.count)
