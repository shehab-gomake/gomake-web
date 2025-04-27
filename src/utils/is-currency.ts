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

//? Used in key val
export const formatValueWithUnit = (value, unit) => {
  if (!unit) return value;
  return isCurrency(unit) ? `${unit} ${value}` : `${value} ${unit}`;
};
