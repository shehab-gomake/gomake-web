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
  // Analyzed image from API response (base64 string without prefix)
  analyzedImage?: string | null;
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

      // Store the analyzed image from API response
      const analyzedImage = attributes?.image ?? null;

      // Get all additional fields from attributes that aren't explicitly mapped
      // This includes fields like DieUnitLidHeight_LID, DieUnitFlapLength_FOLD, etc.
      const additionalFields: Record<string, any> = {};
      if (attributes) {
        Object.keys(attributes).forEach((key) => {
          // Skip fields that are already explicitly mapped
          const mappedKeys = [
            'code', 'shape', 'name', 'image', 'type', 'pdfUrl', 'dxfUrl',
            'unitWidth', 'unitLength', 'columnsAmount', 'linesAmount',
            'spaceBetweenColumns', 'spaceBetweenLines', 'directions',
            'price', 'currency', 'isOutSource',
            'width', 'length', 'finalUnitWidth', 'finalUnitLength', 'finalUnitHeight',
            'cuttingLineLength', 'scoringLineLength', 'perforationLineLength'
          ];
          
          if (!mappedKeys.includes(key)) {
            additionalFields[key] = attributes[key];
          }
        });
      }

      if (materialType === "DieKissCut") {
        return {
          ...file,
          status: "completed" as const,
          materialType,
          analyzedImage,
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
          // Include all additional fields from API response
          ...additionalFields,
        };
      } else {
        // DieCut fields mapping
        return {
          ...file,
          status: "completed" as const,
          materialType: materialType || "DieCut",
          analyzedImage,
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
          // Include all additional fields from API response
          ...additionalFields,
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
      // Use analyzed image from API if available, otherwise fallback to original base64
      // The analyzed image is already a base64 string, we just need to add the prefix
      const imageBase64 = file.analyzedImage || file.base64;
      const image = imageBase64 ? `data:image/png;base64,${imageBase64}` : "";
      
      // Fields to exclude from the payload (internal fields)
      const excludeFields = ['id', 'fileName', 'file', 'base64', 'analyzedImage', 'status', 'materialType'];
      
      // Start with base rowData
      let rowData: Record<string, any> = {};

      if (file.materialType === "DieKissCut") {
        rowData = {
          unitWidth: file.unitWidthInMm_DieKissCut?.toString() ?? "",
          unitLength: file.unitLengthInMm_DieKissCut?.toString() ?? "",
          "columns amount": file.columnsAmount_DieKissCut?.toString() ?? "",
          "lines amount": file.rowsAmount_DieKissCut?.toString() ?? "",
          "space between columns": file.spaceBetweenColumnsInMm_DieKissCut?.toString() ?? "",
          "space between lines": file.spaceBetweenRowsInMm_DieKissCut?.toString() ?? "",
          spaceBetweenColumns: file.spaceBetweenColumnsInMm_DieKissCut?.toString() ?? "",
          spaceBetweenLines: file.spaceBetweenRowsInMm_DieKissCut?.toString() ?? "",
          columnsAmount: file.columnsAmount_DieKissCut?.toString() ?? "",
          linesAmount: file.rowsAmount_DieKissCut?.toString() ?? "",
          directions: file.directions ?? "",
          unitPrice: file.defaultCost_DieKissCut?.toString() ?? "",
          currency: file.currency_DieKissCut ?? "",
          shape: file.shape ?? "",
          name: file.name_DieKissCut ?? "",
          code: file.code_DieKissCut ?? "",
          "Active": "false",
          image: image,
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
          image: image,
          isOutSource: "false",
          Active: "false",
          name: file.name ?? "",
          code: file.code ?? "",
        };
      }

      // Add all additional fields from the file object that are not in the base structure
      // This includes fields like DieUnitLidHeight_LID, DieUnitFlapLength_FOLD, etc.
      Object.keys(file).forEach((key) => {
        // Skip if already in rowData or in excludeFields
        if (rowData.hasOwnProperty(key) || excludeFields.includes(key)) {
          return;
        }
        
        const value = (file as any)[key];
        
        // Only include fields that have values (not null, undefined, or empty string)
        if (value !== null && value !== undefined && value !== '') {
          // Convert to string if it's not already
          if (Array.isArray(value)) {
            rowData[key] = value; // Keep arrays as-is
          } else {
            rowData[key] = String(value);
          }
        }
      });

      return {
        materialKey,
        categoryKey,
        rowData,
      };
    },
    []
  );

  return {
    transformApiResponseToUploadedFile,
    transformUploadedFileToPayload,
  };
};

