import * as XLSX from "xlsx";

interface ExportData {
  agentsData: any[];
  productsData: any[];
  clientsData: any[];
  agentHeaders: string[];
  productHeaders: string[];
  clientHeaders: string[];
  statistics?: any;
  salesItems?: any[];
  dailyDocumentsSummary?: {
    data: any[];
    headers: string[];
  };
}

export const exportDashboardToExcel = (
  data: ExportData,
  fileName: string = "dashboard-data"
) => {
  const workbook = XLSX.utils.book_new();
  let hasSheets = false;

  // Export Agents Performance Data
  if (data.agentsData && data.agentsData.length > 0) {
    const serializeRow = (row: any[]) =>
      row.map((cell) => (typeof cell === "string" || typeof cell === "number" ? cell : String(cell)));
    const agentsWorksheet = XLSX.utils.aoa_to_sheet([
      data.agentHeaders,
      ...data.agentsData.map(serializeRow),
    ]);
    XLSX.utils.book_append_sheet(
      workbook,
      agentsWorksheet,
      "Agents Performance"
    );
    hasSheets = true;
  }

  // Export Products Performance Data
  if (data.productsData && data.productsData.length > 0) {
    const productsWorksheet = XLSX.utils.aoa_to_sheet([
      data.productHeaders,
      ...data.productsData.map((r) => r.map((c) => (typeof c === "string" || typeof c === "number" ? c : String(c)))),
    ]);
    XLSX.utils.book_append_sheet(
      workbook,
      productsWorksheet,
      "Products Performance"
    );
    hasSheets = true;
  }

  // Export Clients Performance Data
  if (data.clientsData && data.clientsData.length > 0) {
    const clientsWorksheet = XLSX.utils.aoa_to_sheet([
      data.clientHeaders,
      ...data.clientsData.map((r) => r.map((c) => (typeof c === "string" || typeof c === "number" ? c : String(c)))),
    ]);
    XLSX.utils.book_append_sheet(
      workbook,
      clientsWorksheet,
      "Clients Performance"
    );
    hasSheets = true;
  }

  // Export Statistics Summary
  if (data.statistics) {
    const statisticsData = [
      ["Metric", "Value"],
      ["Total Sales", data.statistics.totalPrice || "N/A"],
      ["Total Cost", data.statistics.totalCost || "N/A"],
      ["Total Profit", data.statistics.totalProfit || "N/A"],
      [
        "Profit Margin",
        data.statistics.totalPrice && data.statistics.totalProfit
          ? `${(
              (data.statistics.totalProfit / data.statistics.totalPrice) *
              100
            ).toFixed(2)}%`
          : "N/A",
      ],
      ["Success Rate", data.statistics.successRate || "N/A"],
      ["Total Actual Cost", data.statistics.totalActualCost || "N/A"],
    ];
    const statisticsWorksheet = XLSX.utils.aoa_to_sheet(statisticsData);
    XLSX.utils.book_append_sheet(
      workbook,
      statisticsWorksheet,
      "Summary Statistics"
    );
    hasSheets = true;
  }

  // Export Sales Items (Time Series Data)
  if (data.salesItems && data.salesItems.length > 0) {
    const salesHeaders = [
      "Date",
      "Total Cost",
      "Total Price",
      "Average Total Price",
    ];
    const salesData = data.salesItems.map((item) => [
      item.date,
      item.totalCost,
      item.totalPrice,
      item.avgTotalPrice,
    ]);
    const salesWorksheet = XLSX.utils.aoa_to_sheet([
      salesHeaders,
      ...salesData,
    ]);
    XLSX.utils.book_append_sheet(workbook, salesWorksheet, "Sales Time Series");
    hasSheets = true;
  }

  // Export Daily Documents Summary
  if (data.dailyDocumentsSummary && data.dailyDocumentsSummary.data && data.dailyDocumentsSummary.data.length > 0) {
    const dailyDocumentsWorksheet = XLSX.utils.aoa_to_sheet([
      data.dailyDocumentsSummary.headers,
      ...data.dailyDocumentsSummary.data.map((row) =>
        row.map((cell) =>
          typeof cell === "string" || typeof cell === "number" ? cell : String(cell)
        )
      ),
    ]);
    XLSX.utils.book_append_sheet(
      workbook,
      dailyDocumentsWorksheet,
      "Daily Documents Summary"
    );
    hasSheets = true;
  }

  // If no data sheets were added, create a default sheet with a message
  if (!hasSheets) {
    const defaultData = [
      ["No Data Available"],
      ["The dashboard currently has no data to export."],
      ["Please ensure data is loaded before attempting to export."],
    ];
    const defaultWorksheet = XLSX.utils.aoa_to_sheet(defaultData);
    XLSX.utils.book_append_sheet(workbook, defaultWorksheet, "No Data");
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const finalFileName = `${fileName}-${timestamp}.xlsx`;

  // Export the workbook
  XLSX.writeFile(workbook, finalFileName);
};
