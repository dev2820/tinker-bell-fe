import { Waiting } from "@/types/waiting";

const data = [
  {
    time: new Date("2024-06-20T15:30:00"),
    participants: {
      current: 1,
      total: 87,
    },
    status: "in-progress",
  },
  {
    time: new Date("2024-06-03T01:00:00"),
    participants: {
      current: 13,
      total: 82,
    },
    status: "done",
  },
  {
    time: new Date("2024-06-04T10:00:00"),
    participants: {
      current: 34,
      total: 90,
    },
    status: "planned",
  },
] as Waiting[];

export default data;
