import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { analyzeDieCutApi, addPrintHouseMaterialsRowsApi, getMaterialTableHeadersApi } from "@/services/api-service/materials/materials-endpoints";
import { currenciesState, selectedSupplierIdState } from "@/widgets/materials-widget/state";
import { useMaterialsCategories } from "../../use-materials-categories";
import { UploadedFile, useDieCutDataTransform } from "./use-die-cut-data-transform";

// API Response Types
interface ApiResponseItem {
  fileName: string;
  materialType: string;
  attributes: Record<string, any>;
}

export interface MaterialTableHeader {
  key: string;
  value: string;
  unit: string | null;
  isFilter: boolean;
  isForAdmin: boolean | null;
  isHideInDuplicate: boolean | null;
  isRequired: boolean;
  parameterId: string | null;
  isShowInExtraParameters: boolean;
  isPriceObject: boolean | null;
  inputType: number | null;
  filterType: string | null;
  values: Array<{
    key: string;
    specialkey: string | null;
    value: string;
  }>;
}

export interface TableColumn {
  key: string;
  label: string;
  type: "text" | "number" | "dropdown" | "boolean" | "image" | "currency";
  materialType: string;
  options?: any[];
  placeholder?: string;
  isRequired?: boolean;
  unit?: string | null;
  inputType?: number | null;
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
  const { transformApiResponseToUploadedFile, transformUploadedFileToPayload } = useDieCutDataTransform();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tableHeaders, setTableHeaders] = useState<MaterialTableHeader[]>([]);
  const [loadingHeaders, setLoadingHeaders] = useState(false);

  const materialKey = query?.materialType?.toString() || "";
  const categoryKey = query?.materialCategory?.toString() || "";
  const materialType = query?.materialType?.toString() || "DieCut";

  /**
   * Fetch table headers from API
   */
  const fetchTableHeaders = useCallback(async (materialKey: string) => {
    if (!materialKey) return;
    
    setLoadingHeaders(true);
    const callBack = (res: any) => {
      if (res?.success && res?.data?.tableHeaders) {
        setTableHeaders(res.data.tableHeaders);
      }
      setLoadingHeaders(false);
    };
    await getMaterialTableHeadersApi(callApi, callBack, materialKey);
  }, [callApi]);

  /**
   * Fetch headers when material type changes
   */
  useEffect(() => {
    if (materialType) {
      fetchTableHeaders(materialType);
    }
  }, [materialType, fetchTableHeaders]);

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
              const transformedFile = transformApiResponseToUploadedFile(file, fileResult);
              
              // Refetch headers if material type changed (e.g., DieKissCut)
              if (transformedFile.materialType && transformedFile.materialType !== materialType) {
                fetchTableHeaders(transformedFile.materialType);
              }
              
              return transformedFile;
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
  }, [uploadedFiles, callApi, alertFault, alertSuccessAdded, t, materialType, transformApiResponseToUploadedFile, fetchTableHeaders]);

  /**
   * Handle clear all files
   */
  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  /**
   * Map API header key to UploadedFile field key
   */
  const mapHeaderKeyToFieldKey = useCallback((headerKey: string, materialType: string): string => {
    // Mapping for DieCut fields
    const dieCutMapping: Record<string, string> = {
      width: "widthInCm",
      length: "lengthInCm",
      dieUnitWidth: "dieCutFormWidthInCm",
      dieUnitLength: "dieCutFormLengthInCm",
      finalUnitWidth: "finalProductWidthInCm",
      finalUnitLength: "finalProductLengthInCm",
      finalUnitHeight: "finalProductHeightInCm",
      columnsAmount: "columnsAmount",
      "columns amount": "columnsAmount",
      linesAmount: "rowsAmount",
      "lines amount": "rowsAmount",
      spaceBetweenColumns: "spaceBetweenColumnsInMm",
      "space between columns": "spaceBetweenColumnsInMm",
      spaceBetweenLines: "spaceBetweenRowsInMm",
      "space between lines": "spaceBetweenRowsInMm",
      cuttingLineLength: "cuttingLineLengthInCm",
      scoringLineLength: "scoringLineLengthInCm",
      perforationLineLength: "perforationLineLengthInCm",
      price: "defaultCost",
      currency: "currency",
      code: "code",
      name: "name",
      shape: "shape",
      type: "type",
      image: "image",
      isOutSource: "isOutSource",
      Active: "Active",
    };

    // Mapping for DieKissCut fields - handle both camelCase and spaced versions
    const dieKissCutMapping: Record<string, string> = {
      code: "code_DieKissCut",
      name: "name_DieKissCut",
      shape: "shape",
      unitWidth: "unitWidthInMm_DieKissCut",
      "unit width": "unitWidthInMm_DieKissCut",
      unitLength: "unitLengthInMm_DieKissCut",
      "unit length": "unitLengthInMm_DieKissCut",
      columnsAmount: "columnsAmount_DieKissCut",
      "columns amount": "columnsAmount_DieKissCut",
      linesAmount: "rowsAmount_DieKissCut",
      "lines amount": "rowsAmount_DieKissCut",
      spaceBetweenColumns: "spaceBetweenColumnsInMm_DieKissCut",
      "space between columns": "spaceBetweenColumnsInMm_DieKissCut",
      spaceBetweenLines: "spaceBetweenRowsInMm_DieKissCut",
      "space between lines": "spaceBetweenRowsInMm_DieKissCut",
      directions: "directions",
      price: "defaultCost_DieKissCut",
      currency: "currency_DieKissCut",
    };

    const mapping = materialType === "DieKissCut" ? dieKissCutMapping : dieCutMapping;
    return mapping[headerKey] || headerKey;
  }, []);

  /**
   * Determine input type from header inputType
   */
  const getInputTypeFromHeader = useCallback((inputType: number | null, values: any[]): TableColumn["type"] => {
    if (!inputType && inputType !== 0) return "text";
    
    // inputType mapping based on the API response
    // 0 = text, 1 = number, 2 = boolean/dropdown, 3 = number (price), 
    // 5 = dropdown (currency), 6 = dropdown (shape), 7 = image,
    // 12 = dropdown (type), 14 = number, 15 = suppliers, 17 = dropdown
    if (values && values.length > 0) {
      return "dropdown";
    }
    if (inputType === 1 || inputType === 3 || inputType === 14) {
      return "number";
    }
    if (inputType === 2) {
      return "boolean";
    }
    if (inputType === 7) {
      return "image";
    }
    if (inputType === 5) {
      return "currency";
    }
    return "text";
  }, []);

  /**
   * Get table columns based on fetched headers
   */
  const getTableColumns = useCallback((materialType?: string): TableColumn[] => {
    if (!tableHeaders || tableHeaders.length === 0) {
      // Fallback to empty array if headers not loaded yet
      return [];
    }

    const type = materialType || "DieCut";
    
    const filteredHeaders = tableHeaders.filter((header) => {
      // Only show required fields in the table
      // if (header.isRequired !== true) {
      //   return false;
      // }
      
      // Hide specific fields: code, image, type
      if (
        header.key === "code" 
        || 
        header.key === "image" 
        || 
        header.key === "type"
        ||
        header.key === "purchasePricing"
        ||
        header.key ==="totalInventory"
        ||
        header.key ==="Active"
        ||
        header.key ==="isOutSource"
       
      ) {
        return false;
      }
      
      // Hide all boolean fields (inputType === 2)
      // if (header.inputType === 2) {
      //   return false;
      // }
      
      return true;
    });

    return filteredHeaders.map((header) => {
      const fieldKey = mapHeaderKeyToFieldKey(header.key, type);
      
      const inputType = getInputTypeFromHeader(header.inputType, header.values || []);
      
      // Transform values array to options format
      let options: any[] | undefined = undefined;
      if (header.values && header.values.length > 0) {
        options = header.values.map((val) => ({
          key: val.key,
          value: val.value,
          label: val.value,
          specialkey: val.specialkey,
        }));
      }

      // Special handling for currency field
      if (header.key === "currency" && currencies && currencies.length > 0) {
        options = currencies;
      }

      return {
        key: fieldKey,
        label: header.value,
        type: inputType,
        materialType: type,
        options,
        placeholder: header.value,
        isRequired: header.isRequired,
        unit: header.unit,
        inputType: header.inputType,
      };
    });
  }, [tableHeaders, mapHeaderKeyToFieldKey, getInputTypeFromHeader, currencies]);

  /**
   * Validate file fields using table headers isRequired
   */
  const validateFileFieldsWithHeaders = useCallback((file: UploadedFile): string[] => {
    const missing: string[] = [];
    const columns = getTableColumns(file.materialType || materialType);

    columns.forEach((column) => {
      if (column.isRequired) {
        const value = file[column.key as keyof UploadedFile];
        if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
          missing.push(column.label);
        }
      }
    });

    return missing;
  }, [getTableColumns, materialType]);

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
      const missing = validateFileFieldsWithHeaders(file);
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
  }, [uploadedFiles, callApi, alertFault, alertSuccess, t, materialKey, categoryKey, onClose, handleRefreshMaterialData, transformUploadedFileToPayload, validateFileFieldsWithHeaders]);

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
    tableHeaders,
    loadingHeaders,
  };
};

