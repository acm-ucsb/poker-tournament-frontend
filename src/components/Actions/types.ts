export type Step = {
  order: number;
  title: string;
  description: string;
  children: React.ReactNode;
  disabled?: boolean;
};
