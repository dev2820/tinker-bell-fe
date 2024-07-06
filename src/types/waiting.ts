export type Waiting = {
  time: Date;
  participants: {
    current: number;
    total: number;
  };
  status: "in-progress" | "done" | "planned";
};
