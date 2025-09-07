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
  
  // Format numbers with 2 decimal places and comma separators
  const formatNumber = (num) => {
    if (num == null || num === undefined) return "0";
    if (typeof num === "string") {
      const parsed = parseFloat(num);
      return isNaN(parsed) ? num : parsed.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };
  
  const formattedValue = formatNumber(value);
  return isCurrency(unit) ? `${unit} ${formattedValue}` : `${formattedValue} ${unit}`;
};
