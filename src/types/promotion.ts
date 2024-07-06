import { Waiting } from "./waiting";

export type Promotion = {
  id: string;
  title: string;
  duration: {
    start: Date;
    end: Date;
  };
  participants: {
    current: number;
    total: number;
  };
  waitings: Waiting[];
};
