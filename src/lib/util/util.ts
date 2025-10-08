export function formatChips(amount: number, shorten: boolean = true): string {
  const amt = Math.max(0, amount);

  const formatter = Intl.NumberFormat("en", {
    notation: shorten ? "compact" : "standard",
    maximumSignificantDigits: shorten ? 3 : undefined,
  });

  return formatter.format(amt);
}
