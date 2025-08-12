import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguageFromExtension({
  extension,
}: {
  extension: string;
}): string {
  switch (extension.toLowerCase()) {
    case "py":
      return "python";
    case "cpp":
      return "cpp";
    default:
      return "plaintext";
  }
}
