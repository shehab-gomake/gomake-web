// Used for creating document
export const validateDocument = (
  quoteItemValue: any,
  isCustomer: boolean = true
): string | null => {
  if (!quoteItemValue?.client) {
    return `home.admin.${
      isCustomer ? "pleaseSelectClient" : "pleaseSelectSupplier"
    }`;
  }
  if (
    !quoteItemValue?.documentItems ||
    quoteItemValue.documentItems.length === 0
  ) {
    return "alerts.noItems";
  }

  const seenItems = new Set();
  for (const item of quoteItemValue.documentItems) {
    const productCode = item.productCode || item.code;

    if (!productCode) {
      return "alerts.itemWithoutProductCode";
    }

    if (item.quantity == null || item.quantity === 0) {
      return "alerts.itemWithoutQuantity";
    }

    if (item.quantity < 0) {
      return "alerts.itemWithNegativeQuantity";
    }

    /*if (item.price == null || item.price === 0) {
      return "alerts.itemWithoutUnitPrice";
    }*/

    /*if (item.price < 0) {
      return "alerts.itemWithNegativeUnitPrice";
    }*/

    /*if (!item.finalPrice && item.finalPrice !== 0) {
      return "alerts.itemWithoutTotalPrice";
    }

    if (item.finalPrice < 0) {
      return "alerts.itemWithNegativeTotalPrice";
    }*/

    const itemKey = item.sourceDocumentItemId
      ? `id-${item.sourceDocumentItemId}`
      : `code-${item.code}-price-${item.price}-qty-${item.quantity}`;

    if (item.sourceDocumentItemId && seenItems.has(itemKey)) {
      return "alerts.duplicatedItems";
    }
    seenItems.add(itemKey);
  }

  if (quoteItemValue.totalPrice === 0) {
    return "alerts.cannotCreateWithPriceZero";
  }

  return null; // No errors
};
