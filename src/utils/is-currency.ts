export const isCurrency = (unit) => {
    const currencySymbols = ["$", "€", "£", "¥", "₪", "₹", "₽", "₩", "฿"];
    return currencySymbols.includes(unit);
};