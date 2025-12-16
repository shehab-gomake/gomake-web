import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { analyzeDieCutApi, addPrintHouseMaterialsRowsApi } from "@/services/api-service/materials/materials-endpoints";
import { currenciesState, selectedSupplierIdState } from "@/widgets/materials-widget/state";
import { useMaterialsCategories } from "../../use-materials-categories";
import { UploadedFile, useDieCutDataTransform } from "./use-die-cut-data-transform";

// API Response Types
interface ApiResponseItem {
  fileName: string;
  materialType: string;
  attributes: Record<string, any>;
}

export interface TableColumn {
  key: string;
  label: string;
  type: "text" | "number";
  materialType: string;
  options?: any[];
  placeholder?: string;
}

/**
 * Main hook for Die-Cut Analyzer functionality
 * Handles all business logic: file management, API calls, validation, etc.
 */
export const useDieCutAnalyzer = (onClose: () => void) => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFault, alertSuccess } = useSnackBar();
  const currencies = useRecoilValue(currenciesState);
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const { getMaterialCategoryData } = useMaterialsCategories(false);
  const { transformApiResponseToUploadedFile, transformUploadedFileToPayload, validateFileFields } = useDieCutDataTransform();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const materialKey = query?.materialType?.toString() || "";
  const categoryKey = query?.materialCategory?.toString() || "";
  const materialType = query?.materialType?.toString();

  /**
   * Convert file to base64 string
   */
  const convertFileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const newFiles: UploadedFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
        if (!validTypes.includes(file.type)) {
          alertFault(t("materials.dieCutAnalyzer.invalidFileType"));
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          alertFault(t("materials.dieCutAnalyzer.fileTooLarge"));
          continue;
        }

        try {
          const base64 = await convertFileToBase64(file);
          newFiles.push({
            id: `${Date.now()}-${i}`,
            fileName: file.name,
            file,
            base64,
            status: "ready",
          });
        } catch (error) {
          alertFault(t("materials.dieCutAnalyzer.fileReadError"));
        }
      }

      if (newFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [alertFault, t, convertFileToBase64]
  );

  /**
   * Handle drag and drop
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      if (e.target) {
        e.target.value = "";
      }
    },
    [handleFileSelect]
  );

  /**
   * Refresh material data
   */
  const handleRefreshMaterialData = useCallback(() => {
    if (materialType && categoryKey) {
      getMaterialCategoryData(
        materialType,
        categoryKey,
        [],
        supplierId,
      ).then();
    }
  }, [materialType, categoryKey, supplierId, getMaterialCategoryData]);

  /**
   * Handle analyze files
   */
  const handleAnalyze = useCallback(async () => {
    const readyFiles = uploadedFiles.filter((f) => f.status === "ready");
    if (readyFiles.length === 0) {
      alertFault(t("materials.dieCutAnalyzer.noFilesToAnalyze"));
      return;
    }

    setUploadedFiles((prev) =>
      prev.map((f) => (f.status === "ready" ? { ...f, status: "analyzing" } : f))
    );

    const payload = readyFiles.map((file) => ({
      base64Image: file.base64,
      fileName: file.fileName,
      materialType: materialType || "",
    }));

    const callBack = (res: any) => {
      if (res.success && res.data) {
        const responseData = res.data?.data || res.data;
        const resultsArray = Array.isArray(responseData) ? responseData : [responseData];

        setUploadedFiles((prev) =>
          prev.map((file) => {
            if (file.status !== "analyzing") {
              return file;
            }

            const fileResult = resultsArray.find(
              (result: ApiResponseItem) => result?.fileName === file.fileName
            );

            if (fileResult) {
              return transformApiResponseToUploadedFile(file, fileResult);
            } else {
              return { ...file, status: "error" as const };
            }
          })
        );

        const hasErrors = resultsArray.length < readyFiles.length;
        if (hasErrors) {
          alertFault(t("materials.dieCutAnalyzer.analysisFailed"));
        } else {
          alertSuccessAdded();
        }
      } else {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.status === "analyzing" ? { ...f, status: "error" as const } : f))
        );
        alertFault(res.message || t("materials.dieCutAnalyzer.analysisFailed"));
      }
    };

    await analyzeDieCutApi(callApi, callBack, payload);
  }, [uploadedFiles, callApi, alertFault, alertSuccessAdded, t, materialType, transformApiResponseToUploadedFile]);

  /**
   * Handle clear all files
   */
  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  /**
   * Handle add materials
   */
  const handleAddMaterials = useCallback(async () => {
    const completedFiles = uploadedFiles.filter((f) => f.status === "completed");

    if (completedFiles.length === 0) {
      alertFault(t("materials.dieCutAnalyzer.noCompletedFiles"));
      return;
    }

    if (!materialKey || !categoryKey) {
      alertFault(t("materials.dieCutAnalyzer.missingRequiredParams"));
      return;
    }

    const missingFields: Array<{ fileName: string; fields: string[] }> = [];
    completedFiles.forEach((file) => {
      const missing = validateFileFields(file);
      if (missing.length > 0) {
        missingFields.push({ fileName: file.fileName, fields: missing });
      }
    });

    if (missingFields.length > 0) {
      const errorMessages = missingFields.map(
        (item) => `${item.fileName}: ${item.fields.join(", ")}`
      );
      alertFault(
        t("materials.dieCutAnalyzer.missingRequiredFields") + errorMessages.join("\n")
      );
      return;
    }

    const payload = completedFiles.map((file) =>
      transformUploadedFileToPayload(file, materialKey, categoryKey)
    );

    const callBack = async (res: any) => {
      if (res?.success) {
        alertSuccess(res?.message);
        handleRefreshMaterialData();
        onClose();
        setUploadedFiles([]);
      } else {
        alertFault(res?.message || t("materials.dieCutAnalyzer.addMaterialsFailed"));
      }
    };

    await addPrintHouseMaterialsRowsApi(callApi, callBack, payload);
  }, [uploadedFiles, callApi, alertFault, alertSuccess, t, materialKey, categoryKey, onClose, handleRefreshMaterialData, transformUploadedFileToPayload, validateFileFields]);

  /**
   * Handle remove file
   */
  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  /**
   * Handle update file field
   */
  const handleUpdateFileField = useCallback((fileId: string, field: keyof UploadedFile, value: any) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              [field]: value,
            }
          : file
      )
    );
  }, []);

  /**
   * Get status color
   */
  const getStatusColor = useCallback((status: string, primaryColor: (shade: number) => string, neutralColor: (shade: number) => string) => {
    switch (status) {
      case "ready":
        return primaryColor(500);
      case "analyzing":
        return "#FFA500";
      case "completed":
        return "#4CAF50";
      case "error":
        return "#F44336";
      default:
        return neutralColor(500);
    }
  }, []);

  /**
   * Get status label
   */
  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "ready":
        return t("materials.dieCutAnalyzer.status.ready");
      case "analyzing":
        return t("materials.dieCutAnalyzer.status.analyzing");
      case "completed":
        return t("materials.dieCutAnalyzer.status.completed");
      case "error":
        return t("materials.dieCutAnalyzer.status.error");
      default:
        return status;
    }
  }, [t]);

  /**
   * Get display value
   */
  const getDisplayValue = useCallback((value: any) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return value;
  }, []);

  /**
   * Get directions options
   */
  const getDirectionsOptions = useCallback(() => {
    return [
      { key: "long", Specialkey: null, value: "Long", label: "Long" },
      { key: "short", Specialkey: null, value: "Short", label: "Short" },
    ];
  }, []);

  /**
   * Get shape options
   */
  const getShapeOptions = useCallback(() => {
    return [
      { key: "Shape_rectangular", Specialkey: null, value: "Shape_rectangular", label: "Shape_rectangular" },
      { key: "Shape_circular", Specialkey: null, value: "Shape_circular", label: "Shape_circular" },
      { key: "Shape_formal", Specialkey: null, value: "Shape_formal", label: "Shape_formal" },
    ];
  }, []);

  /**
   * Get table columns based on material type
   */
  const getTableColumns = useCallback((materialType?: string): TableColumn[] => {
    const directionsOptions = getDirectionsOptions();
    const shapeOptions = getShapeOptions();

    if (materialType === "DieKissCut") {
      return [
        { key: "code_DieKissCut", label: t("materials.dieCutAnalyzer.table.code"), type: "text", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.code") },
        { key: "shape", label: t("materials.dieCutAnalyzer.table.shape"), type: "text", materialType: "DieKissCut", options: shapeOptions, placeholder: t("materials.dieCutAnalyzer.placeholders.selectShape") },
        { key: "name_DieKissCut", label: t("materials.dieCutAnalyzer.table.name"), type: "text", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.name") },
        { key: "unitWidthInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.unitWidth"), type: "number", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.unitWidth") },
        { key: "unitLengthInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.unitLength"), type: "number", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.unitLength") },
        { key: "columnsAmount_DieKissCut", label: t("materials.dieCutAnalyzer.table.columnsAmount"), type: "number", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.columnsAmount") },
        { key: "rowsAmount_DieKissCut", label: t("materials.dieCutAnalyzer.table.rowsAmount"), type: "number", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.rowsAmount") },
        { key: "spaceBetweenColumnsInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.spaceBetweenColumns"), type: "number", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.spaceBetweenColumns") },
        { key: "spaceBetweenRowsInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.spaceBetweenLines"), type: "number", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.spaceBetweenRows") },
        { key: "directions", label: t("materials.dieCutAnalyzer.table.directions"), type: "text", materialType: "DieKissCut", options: directionsOptions, placeholder: t("materials.dieCutAnalyzer.placeholders.selectDirections") },
        { key: "defaultCost_DieKissCut", label: t("materials.dieCutAnalyzer.table.defaultCost"), type: "number", materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.defaultCost") },
        { key: "currency_DieKissCut", label: t("materials.dieCutAnalyzer.table.currency"), type: "text", options: currencies, materialType: "DieKissCut", placeholder: t("materials.dieCutAnalyzer.placeholders.selectCurrency") },
      ];
    } else {
      return [
        { key: "shape", label: t("materials.dieCutAnalyzer.table.shape"), type: "text", materialType: "DieCut", options: shapeOptions, placeholder: t("materials.dieCutAnalyzer.placeholders.selectShape") },
        { key: "widthInCm", label: t("materials.dieCutAnalyzer.table.width"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.width") || "Enter width (CM)" },
        { key: "lengthInCm", label: t("materials.dieCutAnalyzer.table.length"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.length") || "Enter length (CM)" },
        { key: "dieCutFormWidthInCm", label: t("materials.dieCutAnalyzer.table.dieUnitWidth"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.dieUnitWidth") || "Enter die unit width (CM)" },
        { key: "dieCutFormLengthInCm", label: t("materials.dieCutAnalyzer.table.dieUnitLength"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.dieUnitLength") || "Enter die unit length (CM)" },
        { key: "finalProductWidthInCm", label: t("materials.dieCutAnalyzer.table.finalUnitWidth"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.finalUnitWidth") || "Enter final unit width (CM)" },
        { key: "finalProductLengthInCm", label: t("materials.dieCutAnalyzer.table.finalUnitLength"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.finalUnitLength") || "Enter final unit length (CM)" },
        { key: "finalProductHeightInCm", label: t("materials.dieCutAnalyzer.table.finalUnitHeight"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.finalUnitHeight") || "Enter final unit height (CM)" },
        { key: "columnsAmount", label: t("materials.dieCutAnalyzer.table.columnsAmount"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.columnsAmount") || "Enter columns" },
        { key: "rowsAmount", label: t("materials.dieCutAnalyzer.table.rowsAmount"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.rowsAmount") || "Enter rows" },
        { key: "spaceBetweenColumnsInMm", label: t("materials.dieCutAnalyzer.table.spaceBetweenColumns"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.spaceBetweenColumns") || "Enter space (MM)" },
        { key: "spaceBetweenRowsInMm", label: t("materials.dieCutAnalyzer.table.spaceBetweenLines"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.spaceBetweenRows") || "Enter space (MM)" },
        { key: "cuttingLineLengthInCm", label: t("materials.dieCutAnalyzer.table.cuttingLineLength"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.cuttingLineLength") || "Enter cutting line length (CM)" },
        { key: "scoringLineLengthInCm", label: t("materials.dieCutAnalyzer.table.scoringLineLength"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.scoringLineLength") || "Enter scoring line length (CM)" },
        { key: "perforationLineLengthInCm", label: t("materials.dieCutAnalyzer.table.perforationLineLength"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.perforationLineLength") || "Enter perforation line length (CM)" },
        { key: "defaultCost", label: t("materials.dieCutAnalyzer.table.defaultCost"), type: "number", materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.defaultCost") || "Enter cost" },
        { key: "currency", label: t("materials.dieCutAnalyzer.table.currency"), type: "text", options: currencies, materialType: "DieCut", placeholder: t("materials.dieCutAnalyzer.placeholders.selectCurrency") || "Select currency" },
      ];
    }
  }, [t, currencies, getDirectionsOptions, getShapeOptions]);

  // Computed values
  const readyFilesCount = uploadedFiles.filter((f) => f.status === "ready").length;
  const completedFilesCount = uploadedFiles.filter((f) => f.status === "completed").length;
  const canAddMaterials = readyFilesCount === 0 && completedFilesCount > 0;

  /**
   * Clear all data (exposed for cleanup)
   */
  const clearAllData = useCallback(() => {
    setUploadedFiles([]);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    uploadedFiles,
    isDragging,
    fileInputRef,
    readyFilesCount,
    canAddMaterials,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInputChange,
    handleAnalyze,
    handleClearAll,
    handleAddMaterials,
    handleRemoveFile,
    handleUpdateFileField,
    getStatusColor,
    getStatusLabel,
    getDisplayValue,
    getTableColumns,
    clearAllData,
  };
};

