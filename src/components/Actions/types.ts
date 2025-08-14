export type Step = {
  title: string;
  description: string;
  children: React.ReactNode;
  disabled?: boolean;
  completed?: boolean;
  incomplete?: boolean;
};
