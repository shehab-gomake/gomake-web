import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// API Response Types
interface ApiAttributes {
  code?: string | null;
  shape?: string | null;
  name?: string | null;
  image?: string | null;
  unitWidth?: number | null;
  unitLength?: number | null;
  columnsAmount?: number | null;
  linesAmount?: number | null;
  spaceBetweenColumns?: number | null;
  spaceBetweenLines?: number | null;
  directions?: string | null;
  price?: number | null;
  currency?: string | null;
  isOutSource?: boolean | null;
  // DieCut specific fields
  width?: number | null;
  length?: number | null;
  finalUnitWidth?: number | null;
  finalUnitLength?: number | null;
  finalUnitHeight?: number | null;
  cuttingLineLength?: number | null;
  scoringLineLength?: number | null;
  perforationLineLength?: number | null;
}

interface ApiResponseItem {
  fileName: string;
  materialType: string;
  attributes: ApiAttributes;
}

// UploadedFile interface (matches the component's interface)
export interface UploadedFile {
  id: string;
  fileName: string;
  file: File;
  base64: string;
  status: "ready" | "analyzing" | "completed" | "error";
  materialType?: string;
  // DieCut fields
  shape?: string | null;
  widthInCm?: number | string | null;
  lengthInCm?: number | string | null;
  dieCutFormWidthInCm?: number | string | null;
  dieCutFormLengthInCm?: number | string | null;
  finalProductWidthInCm?: number | string | null;
  finalProductLengthInCm?: number | string | null;
  finalProductHeightInCm?: number | string | null;
  columnsAmount?: number | string | null;
  rowsAmount?: number | string | null;
  spaceBetweenColumnsInMm?: number | string | null;
  spaceBetweenRowsInMm?: number | string | null;
  cuttingLineLengthInCm?: number | string | null;
  scoringLineLengthInCm?: number | string | null;
  perforationLineLengthInCm?: number | string | null;
  defaultCost?: number | string | null;
  currency?: string | null;
  // DieKissCut fields
  unitWidthInMm_DieKissCut?: number | string | null;
  unitLengthInMm_DieKissCut?: number | string | null;
  columnsAmount_DieKissCut?: number | string | null;
  rowsAmount_DieKissCut?: number | string | null;
  spaceBetweenColumnsInMm_DieKissCut?: number | string | null;
  spaceBetweenRowsInMm_DieKissCut?: number | string | null;
  directions?: string | null;
  defaultCost_DieKissCut?: number | string | null;
  currency_DieKissCut?: string | null;
  name_DieKissCut?: string | null;
  code_DieKissCut?: string | null;
  name?: string | null;
  code?: string | null;
}

// Payload types for adding materials
export interface AddMaterialPayload {
  materialKey: string;
  categoryKey: string;
  rowData: Record<string, any>;
}

/**
 * Hook to handle data transformation for Die-Cut Analyzer
 * Transforms API response to UploadedFile format and UploadedFile to payload format
 */
export const useDieCutDataTransform = () => {
  const { t } = useTranslation();

  /**
   * Transform API response (with nested attributes) to UploadedFile format
   */
  const transformApiResponseToUploadedFile = useCallback(
    (file: UploadedFile, apiResponse: ApiResponseItem): UploadedFile => {
      const { materialType, attributes } = apiResponse;

      if (materialType === "DieKissCut") {
        return {
          ...file,
          status: "completed" as const,
          materialType,
          // DieKissCut fields mapping
          shape: attributes?.shape ?? null,
          unitWidthInMm_DieKissCut: attributes?.unitWidth ?? null,
          unitLengthInMm_DieKissCut: attributes?.unitLength ?? null,
          columnsAmount_DieKissCut: attributes?.columnsAmount ?? null,
          rowsAmount_DieKissCut: attributes?.linesAmount ?? null,
          spaceBetweenColumnsInMm_DieKissCut: attributes?.spaceBetweenColumns ?? null,
          spaceBetweenRowsInMm_DieKissCut: attributes?.spaceBetweenLines ?? null,
          directions: attributes?.directions ?? null,
          defaultCost_DieKissCut: attributes?.price ?? null,
          currency_DieKissCut: attributes?.currency ?? null,
          name_DieKissCut: attributes?.name ?? null,
          code_DieKissCut: attributes?.code ?? null,
        };
      } else {
        // DieCut fields mapping
        return {
          ...file,
          status: "completed" as const,
          materialType: materialType || "DieCut",
          shape: attributes?.shape ?? null,
          widthInCm: attributes?.width ?? null,
          lengthInCm: attributes?.length ?? null,
          dieCutFormWidthInCm: attributes?.unitWidth ?? null,
          dieCutFormLengthInCm: attributes?.unitLength ?? null,
          finalProductWidthInCm: attributes?.finalUnitWidth ?? null,
          finalProductLengthInCm: attributes?.finalUnitLength ?? null,
          finalProductHeightInCm: attributes?.finalUnitHeight ?? null,
          columnsAmount: attributes?.columnsAmount ?? null,
          rowsAmount: attributes?.linesAmount ?? null,
          spaceBetweenColumnsInMm: attributes?.spaceBetweenColumns ?? null,
          spaceBetweenRowsInMm: attributes?.spaceBetweenLines ?? null,
          cuttingLineLengthInCm: attributes?.cuttingLineLength ?? null,
          scoringLineLengthInCm: attributes?.scoringLineLength ?? null,
          perforationLineLengthInCm: attributes?.perforationLineLength ?? null,
          defaultCost: attributes?.price ?? null,
          currency: attributes?.currency ?? null,
          name: attributes?.name ?? null,
          directions: attributes?.directions ?? null,
        };
      }
    },
    []
  );

  /**
   * Transform UploadedFile to payload format for adding materials
   */
  const transformUploadedFileToPayload = useCallback(
    (file: UploadedFile, materialKey: string, categoryKey: string): AddMaterialPayload => {
      const image = file.base64;
      let rowData: Record<string, any> = {};

      if (file.materialType === "DieKissCut") {
        rowData = {
          unitWidth: file.unitWidthInMm_DieKissCut?.toString() ?? "",
          unitLength: file.unitLengthInMm_DieKissCut?.toString() ?? "",
          "columns amount": file.columnsAmount_DieKissCut?.toString() ?? "",
          "lines amount": file.rowsAmount_DieKissCut?.toString() ?? "",
          "space between columns": file.spaceBetweenColumnsInMm_DieKissCut?.toString() ?? "",
          "space between lines": file.spaceBetweenRowsInMm_DieKissCut?.toString() ?? "",
          directions: file.directions ?? "",
          unitPrice: file.defaultCost_DieKissCut?.toString() ?? "",
          currency: file.currency_DieKissCut ?? "",
          shape: file.shape ?? "",
          name: file.name_DieKissCut ?? "",
          code: file.code_DieKissCut ?? "",
          "Active": "false",
          "image": `data:image/png;base64,${image}`,
          isOutSource: "false",
        };
      } else {
        // DieCut
        rowData = {
          shape: file.shape ?? "",
          width: file.widthInCm?.toString() ?? "",
          length: file.lengthInCm?.toString() ?? "",
          dieUnitWidth: file.dieCutFormWidthInCm?.toString() ?? "",
          dieUnitLength: file.dieCutFormLengthInCm?.toString() ?? "",
          finalUnitWidth: file.finalProductWidthInCm?.toString() ?? "",
          finalUnitLength: file.finalProductLengthInCm?.toString() ?? "",
          finalUnitHeight: file.finalProductHeightInCm?.toString() ?? "",
          columnsAmount: file.columnsAmount?.toString() ?? "",
          linesAmount: file.rowsAmount?.toString() ?? "",
          spaceBetweenColumns: file.spaceBetweenColumnsInMm?.toString() ?? "",
          spaceBetweenLines: file.spaceBetweenRowsInMm?.toString() ?? "",
          cuttingLineLength: file.cuttingLineLengthInCm?.toString() ?? "",
          scoringLineLength: file.scoringLineLengthInCm?.toString() ?? "",
          perforationLineLength: file.perforationLineLengthInCm?.toString() ?? "",
          unitPrice: file.defaultCost?.toString() ?? "",
          currency: file.currency ?? "",
          image: `data:image/png;base64,${image}`,
          isOutSource: "false",
          Active: "false",
          name: file.name ?? "",
          code: file.code ?? "",
        };
      }

      return {
        materialKey,
        categoryKey,
        rowData,
      };
    },
    []
  );

  /**
   * Validate required fields for a file
   */
  const validateFileFields = useCallback(
    (file: UploadedFile): string[] => {
      const missing: string[] = [];

      if (file.materialType === "DieKissCut") {
        if (!file.shape || file.shape === "" || file.shape === null)
          missing.push(t("materials.dieCutAnalyzer.table.shape"));
        if (!file.name_DieKissCut || file.name_DieKissCut === "" || file.name_DieKissCut === null)
          missing.push(t("materials.dieCutAnalyzer.table.name"));
        if (file.unitWidthInMm_DieKissCut === null || file.unitWidthInMm_DieKissCut === undefined || file.unitWidthInMm_DieKissCut === "")
          missing.push(t("materials.dieCutAnalyzer.table.unitWidth"));
        if (file.unitLengthInMm_DieKissCut === null || file.unitLengthInMm_DieKissCut === undefined || file.unitLengthInMm_DieKissCut === "")
          missing.push(t("materials.dieCutAnalyzer.table.unitLength"));
        if (file.columnsAmount_DieKissCut === null || file.columnsAmount_DieKissCut === undefined || file.columnsAmount_DieKissCut === "")
          missing.push(t("materials.dieCutAnalyzer.table.columnsAmount"));
        if (file.rowsAmount_DieKissCut === null || file.rowsAmount_DieKissCut === undefined || file.rowsAmount_DieKissCut === "")
          missing.push(t("materials.dieCutAnalyzer.table.rowsAmount"));
        if (file.spaceBetweenColumnsInMm_DieKissCut === null || file.spaceBetweenColumnsInMm_DieKissCut === undefined || file.spaceBetweenColumnsInMm_DieKissCut === "")
          missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenColumns"));
        if (file.spaceBetweenRowsInMm_DieKissCut === null || file.spaceBetweenRowsInMm_DieKissCut === undefined || file.spaceBetweenRowsInMm_DieKissCut === "")
          missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenRows"));
        if (!file.directions || file.directions === "" || file.directions === null)
          missing.push(t("materials.dieCutAnalyzer.table.directions"));
        if (file.defaultCost_DieKissCut === null || file.defaultCost_DieKissCut === undefined || file.defaultCost_DieKissCut === "")
          missing.push(t("materials.dieCutAnalyzer.table.defaultCost"));
        if (!file.currency_DieKissCut || file.currency_DieKissCut === "" || file.currency_DieKissCut === null)
          missing.push(t("materials.dieCutAnalyzer.table.currency"));
      } else {
        // DieCut validation
        if (!file.shape || file.shape === "" || file.shape === null)
          missing.push(t("materials.dieCutAnalyzer.table.shape"));
        if (!file.name || file.name === "" || file.name === null)
          missing.push(t("materials.dieCutAnalyzer.table.name"));
        if (file.dieCutFormWidthInCm === null || file.dieCutFormWidthInCm === undefined || file.dieCutFormWidthInCm === "")
          missing.push(t("materials.dieCutAnalyzer.table.dieUnitWidth"));
        if (file.dieCutFormLengthInCm === null || file.dieCutFormLengthInCm === undefined || file.dieCutFormLengthInCm === "")
          missing.push(t("materials.dieCutAnalyzer.table.dieUnitLength"));
        if (file.columnsAmount === null || file.columnsAmount === undefined || file.columnsAmount === "")
          missing.push(t("materials.dieCutAnalyzer.table.columnsAmount"));
        if (file.rowsAmount === null || file.rowsAmount === undefined || file.rowsAmount === "")
          missing.push(t("materials.dieCutAnalyzer.table.rowsAmount"));
        if (file.spaceBetweenColumnsInMm === null || file.spaceBetweenColumnsInMm === undefined || file.spaceBetweenColumnsInMm === "")
          missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenColumns"));
        if (file.spaceBetweenRowsInMm === null || file.spaceBetweenRowsInMm === undefined || file.spaceBetweenRowsInMm === "")
          missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenRows"));
        if (file.defaultCost === null || file.defaultCost === undefined || file.defaultCost === "")
          missing.push(t("materials.dieCutAnalyzer.table.defaultCost"));
        if (!file.currency || file.currency === "" || file.currency === null)
          missing.push(t("materials.dieCutAnalyzer.table.currency"));
      }

      return missing;
    },
    [t]
  );

  return {
    transformApiResponseToUploadedFile,
    transformUploadedFileToPayload,
    validateFileFields,
  };
};

