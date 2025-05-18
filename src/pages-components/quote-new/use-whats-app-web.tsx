const useWhatsAppWeb = () => {
  const openWhatsAppWebLink = (whatsappMassage, phoneNumber, isWeb = true) => {
    if (!whatsappMassage?.trim()) return;

    debugger;
    const url = isWeb
      ? `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
          whatsappMassage
        )}`
      : `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
          whatsappMassage
        )}`;

    window.open(url, "_blank");
  };

  const getWhatsAppUrl = (message: string, phone: string) => {
    if (!message || !phone) return null;
    const encodedMessage = encodeURIComponent(message);
    const formattedPhone = phone.replace(/[^\d]/g, "");
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  const getWhatsWebUrl = (message: string, phone: string) => {
    if (!message || !phone) return null;
    const encodedMessage = encodeURIComponent(message);
    const formattedPhone = phone.replace(/[^\d]/g, "");
    return `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
  };

  return {
    openWhatsAppWebLink,
    getWhatsAppUrl,
    getWhatsWebUrl,
  };
};
export { useWhatsAppWeb };
