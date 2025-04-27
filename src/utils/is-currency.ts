export const isCurrency = (unit) => {
  const currencySymbols = [
    "$",
    "€",
    "£",
    "¥",
    "₪",
    "₹",
    "₽",
    "₩",
    "฿",
    "₴",
    "₦",
    "₵",
    "د.إ",
    "ر.س",
    "₺",
    "₫",
    "R$",
    "A$",
    "C$",
    "NZ$",
  ];
  return currencySymbols.includes(unit);
};

// Formats a value with its unit, handling currency differently
export const formatValueWithUnit = (value, unit) => {
  if (!unit) return value;
  return isCurrency(unit) ? `${unit} ${value}` : `${value} ${unit}`;
};
