const useWhatsAppWeb = () => {
  // const openWhatsAppWebLink = (whatsappMassage, phoneNumber, isWhatsAppWeb) => {
  //   if (whatsappMassage && whatsappMassage.trim()) {
  //     const url = isWhatsAppWeb
  //       ? `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
  //           whatsappMassage
  //         )}`
  //       : `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
  //           whatsappMassage
  //         )}`;

  //     window.open(url, "_blank");
  //   }
  // };

  // const openWhatsAppWebLink = (whatsappMassage, phoneNumber) => {
  //   if (whatsappMassage && whatsappMassage.trim()) {
  //     const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
  //       whatsappMassage
  //     )}`;
  //     window.open(url, "_blank");
  //   }
  // };

  const openWhatsAppWebLink = (whatsappMassage, phoneNumber, isWeb = true) => {
    if (!whatsappMassage?.trim()) return;

    const url = isWeb
      ? `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
          whatsappMassage
        )}`
      : `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
          whatsappMassage
        )}`;

    window.open(url, "_blank");
  };

  return {
    openWhatsAppWebLink,
  };
};
export { useWhatsAppWeb };
