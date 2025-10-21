import * as XLSX from "xlsx";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface ExportQuoteData {
  documentItems: any[];
  documentType: DOCUMENT_TYPE;
  documentNumber?: string;
  clientName?: string;
  t: (key: string) => string;
}

/**
 * Export quote/order/invoice document items to Excel
 */
export const exportQuoteToExcel = ({
  documentItems,
  documentType,
  documentNumber,
  clientName,
  t,
}: ExportQuoteData) => {
  if (!documentItems || documentItems.length === 0) {
    return;
  }

  const workbook = XLSX.utils.book_new();

  // Prepare headers based on the quote table structure
  const headers = [
    "#",
    t("sales.quote.itemCode"),
    t("products.profits.itemName"),
    t("products.profits.details"),
    t("sales.quote.amount"),
    t("products.profits.pricingListWidget.unitPrice"),
    t("sales.quote.discount"),
    t("products.offsetPrice.admin.finalPrice"),
  ];

  // Helper function to clean HTML and extract text from details
  const cleanDetails = (details: string) => {
    if (!details) return "";
    // Remove HTML tags
    const withoutTags = details.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    const textarea = document.createElement("textarea");
    textarea.innerHTML = withoutTags;
    return textarea.value;
  };

  // Prepare data rows
  const dataRows = documentItems
    .filter((item) => item.productType !== 1) // Filter out delivery items if needed
    .map((item, index) => [
      index + 1,
      item.code || item.productCode || "",
      item.productName || "",
      cleanDetails(item.details || item.workName || ""),
      item.quantity || 0,
      item.price || 0,
      item.discount || 0,
      item.finalPrice || 0,
    ]);

  // Create worksheet with headers and data
  const worksheetData = [headers, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 5 },  // #
    { wch: 15 }, // Item Code
    { wch: 30 }, // Item Name
    { wch: 100 }, // Details
    { wch: 15 }, // Amount
    { wch: 15 }, // Unit Price
    { wch: 15 }, // Discount
    { wch: 15 }, // Final Price
  ];

  // Add worksheet to workbook
  const documentTypeText = t(`sales.quote.${DOCUMENT_TYPE[documentType]}`);
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    documentTypeText || "Document"
  );

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const docNumText = documentNumber ? `_${documentNumber}` : "";
  const clientText = clientName ? `_${clientName.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
  const finalFileName = `${documentTypeText}${docNumText}${clientText}_${timestamp}.xlsx`;

  // Export the workbook
  XLSX.writeFile(workbook, finalFileName);
};

