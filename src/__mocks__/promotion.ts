import waitings from "./waiting";

const data = [
  {
    id: "promo1",
    title: "Summer Sale",
    duration: {
      start: new Date("2024-06-01"),
      end: new Date("2024-06-30"),
    },
    participants: {
      current: 300,
      total: 500,
    },
    waitings,
  },
  {
    id: "promo2",
    title: "Back to School",
    duration: {
      start: new Date("2024-08-15"),
      end: new Date("2024-09-15"),
    },
    participants: {
      current: 300,
      total: 500,
    },
    waitings: [],
  },
  {
    id: "promo3",
    title: "Black Friday",
    duration: {
      start: new Date("2024-11-25"),
      end: new Date("2024-11-30"),
    },
    participants: {
      current: 300,
      total: 500,
    },
    waitings,
  },
  {
    id: "promo4",
    title: "Holiday Discounts",
    duration: {
      start: new Date("2024-12-15"),
      end: new Date("2024-12-31"),
    },
    participants: {
      current: 300,
      total: 500,
    },
    waitings,
  },
  {
    id: "promo5",
    title: "New Year Sale",
    duration: {
      start: new Date("2025-01-01"),
      end: new Date("2025-01-07"),
    },
    participants: {
      current: 300,
      total: 500,
    },
    waitings,
  },
  {
    id: "promo6",
    title: "Spring Clearance",
    duration: {
      start: new Date("2025-03-01"),
      end: new Date("2025-03-31"),
    },
    participants: {
      current: 300,
      total: 500,
    },
    waitings,
  },
];

export default data;
