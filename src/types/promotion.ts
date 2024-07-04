export type Promotion = {
  id: string;
  title: string;
  duration: {
    start: Date;
    end: Date;
  };
};
