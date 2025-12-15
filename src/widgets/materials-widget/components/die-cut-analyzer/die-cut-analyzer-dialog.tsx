import React, { useState, useRef, useCallback } from "react";
import { GoMakeDialog } from "@/components/dialog";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { analyzeDieCutApi, addPrintHouseMaterialsRowsApi } from "@/services/api-service/materials/materials-endpoints";
import { getPrintHouseMaterialCategoryDataNewApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currenciesState, selectedSupplierIdState, materialsTablePageState, selectedSuppliersIdsState, activeFilterState, materialCategoryDataState } from "@/widgets/materials-widget/state";
import { GoMakeAutoComplate } from "@/components";
import { useMaterialsCategories } from "../../use-materials-categories";

interface UploadedFile {
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

interface DieCutAnalyzerDialogProps {
  open: boolean;
  onClose: () => void;
}

const DieCutAnalyzerDialog: React.FC<DieCutAnalyzerDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const { primaryColor, neutralColor } = useGomakeTheme();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFault, alertSuccess } = useSnackBar();
  const { query } = useRouter();
  const { materialType } = query;
  const currencies = useRecoilValue(currenciesState);
  const supplierId = useRecoilValue(selectedSupplierIdState);
  const pageNumber = useRecoilValue(materialsTablePageState);
  const suppliersIds = useRecoilValue(selectedSuppliersIdsState);
  const activeFilter = useRecoilValue(activeFilterState);
  const setMaterialCategoryData = useSetRecoilState(materialCategoryDataState);
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const materialKey = query?.materialType?.toString() || "";
  const categoryKey = query?.materialCategory?.toString() || "";

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:*/*;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const newFiles: UploadedFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Validate file type
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
        if (!validTypes.includes(file.type)) {
          alertFault(t("materials.dieCutAnalyzer.invalidFileType") || "Invalid file type. Please upload PNG, JPG, or PDF files.");
          continue;
        }
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alertFault(t("materials.dieCutAnalyzer.fileTooLarge") || "File size exceeds 10MB limit.");
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
          alertFault(t("materials.dieCutAnalyzer.fileReadError") || "Error reading file.");
        }
      }

      if (newFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [alertFault, t]
  );

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
      // Reset input to allow same file upload again
      if (e.target) {
        e.target.value = "";
      }
    },
    [handleFileSelect]
  );

  const { getMaterialCategoryData } = useMaterialsCategories(false);

  const handleRefreshMaterialData = () => {
    if (materialType && categoryKey) {
      getMaterialCategoryData(
        materialType?.toString(),
        categoryKey?.toString(),
        [],
        supplierId,
      ).then();
    }
  };

  const handleAnalyze = useCallback(async () => {
    const readyFiles = uploadedFiles.filter((f) => f.status === "ready");
    if (readyFiles.length === 0) {
      alertFault(t("materials.dieCutAnalyzer.noFilesToAnalyze") || "No files ready for analysis.");
      return;
    }

    // Update status to analyzing
    setUploadedFiles((prev) =>
      prev.map((f) => (f.status === "ready" ? { ...f, status: "analyzing" } : f))
    );

    // Prepare payload array with all files
    const payload = readyFiles.map((file) => ({
      base64Image: file.base64,
      fileName: file.fileName,
      materialType: materialType?.toString() || "",
    }));

    const callBack = (res: any) => {
      if (res.success && res.data) {
        // Handle response data - API returns an array of results
        const responseData = res.data?.data || res.data;
        const resultsArray = Array.isArray(responseData) ? responseData : [responseData];

        // Map results back to files by fileName
        setUploadedFiles((prev) =>
          prev.map((file) => {
            if (file.status !== "analyzing") {
              return file;
            }

            // Find the result that matches this file by fileName
            const fileResult = resultsArray.find(
              (result: any) => result?.fileName === file.fileName
            );

            if (fileResult) {
              // Extract attributes object from API response
              const attributes = fileResult?.attributes || {};
              const materialType = fileResult?.materialType;

              // Map fields based on materialType
              if (materialType === "DieKissCut") {
                // DieKissCut fields mapping
                const mappedFile: UploadedFile = {
                  ...file,
                  status: "completed" as const,
                  materialType: materialType,

                  // DieKissCut fields - map from attributes
                  shape: attributes?.shape,
                  unitWidthInMm_DieKissCut: attributes?.unitWidth, // API returns in MM
                  unitLengthInMm_DieKissCut: attributes?.unitLength, // API returns in MM
                  columnsAmount_DieKissCut: attributes?.columnsAmount,
                  rowsAmount_DieKissCut: attributes?.linesAmount, // API returns "linesAmount"
                  spaceBetweenColumnsInMm_DieKissCut: attributes?.spaceBetweenColumns,
                  spaceBetweenRowsInMm_DieKissCut: attributes?.spaceBetweenLines,
                  directions: attributes?.directions,
                  defaultCost_DieKissCut: attributes?.price,
                  currency_DieKissCut: attributes?.currency || null,
                  name_DieKissCut: attributes?.name,
                  code_DieKissCut: attributes?.code,
                };
                return mappedFile;
              } else {
                // DieCut fields mapping
                const mappedFile: UploadedFile = {
                  ...file,
                  status: "completed" as const,
                  materialType: materialType || "DieCut",
                  // DieCut fields - map from attributes
                  shape: attributes?.shape,
                  widthInCm: attributes?.width,
                  lengthInCm: attributes?.length,
                  dieCutFormWidthInCm: attributes?.unitWidth,
                  dieCutFormLengthInCm: attributes?.unitLength,
                  finalProductWidthInCm: attributes?.finalUnitWidth,
                  finalProductLengthInCm: attributes?.finalUnitLength,
                  finalProductHeightInCm: attributes?.finalUnitHeight,
                  columnsAmount: attributes?.columnsAmount,
                  rowsAmount: attributes?.linesAmount, // API returns "linesAmount"
                  spaceBetweenColumnsInMm: attributes?.spaceBetweenColumns,
                  spaceBetweenRowsInMm: attributes?.spaceBetweenLines,
                  cuttingLineLengthInCm: attributes?.cuttingLineLength,
                  scoringLineLengthInCm: attributes?.scoringLineLength,
                  perforationLineLengthInCm: attributes?.perforationLineLength,
                  defaultCost: attributes?.price,
                  currency: attributes?.currency || null,
                  name: attributes?.name,
                  directions: attributes?.directions,
                };
                return mappedFile;
              }
            } else {
              return { ...file, status: "error" as const };
            }
          })
        );

        // Check if all files were processed successfully
        const hasErrors = resultsArray.length < readyFiles.length;
        if (hasErrors) {
          alertFault(t("materials.dieCutAnalyzer.analysisFailed") || "Some files failed to analyze");
        } else {
          alertSuccessAdded();
        }
      } else {
        // If API call fails, mark all analyzing files as error
        setUploadedFiles((prev) =>
          prev.map((f) => (f.status === "analyzing" ? { ...f, status: "error" as const } : f))
        );
        alertFault(res.message || t("materials.dieCutAnalyzer.analysisFailed") || "Analysis failed");
      }
    };

    await analyzeDieCutApi(callApi, callBack, payload);
  }, [uploadedFiles, callApi, alertFault, alertSuccessAdded, t]);

  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  const handleAddMaterials = useCallback(async () => {
    const completedFiles = uploadedFiles.filter((f) => f.status === "completed");

    if (completedFiles.length === 0) {
      alertFault(t("materials.dieCutAnalyzer.noCompletedFiles") || "No completed files to add");
      return;
    }

    // Get required data from query params or state
    const materialKey = query?.materialType?.toString() || "";
    const categoryKey = query?.materialCategory?.toString() || "";
    if (!materialKey || !categoryKey) {
      alertFault(t("materials.dieCutAnalyzer.missingRequiredParams") || "Missing required parameters (materialKey, categoryKey)");
      return;
    }

    // Validate required fields for each file
    const missingFields: Array<{ fileName: string; fields: string[] }> = [];

    completedFiles.forEach((file) => {
      const missing: string[] = [];

      // Check required fields based on materialType
      if (file.materialType === "DieKissCut") {
        if (!file.shape || file.shape === "" || file.shape === null) missing.push(t("materials.dieCutAnalyzer.table.shape") || "Shape");
        if (!file.name_DieKissCut || file.name_DieKissCut === "" || file.name_DieKissCut === null) missing.push(t("materials.dieCutAnalyzer.table.name") || "Name");
        if (file.unitWidthInMm_DieKissCut === null || file.unitWidthInMm_DieKissCut === undefined || file.unitWidthInMm_DieKissCut === "") missing.push(t("materials.dieCutAnalyzer.table.unitWidth") || "Unit Width");
        if (file.unitLengthInMm_DieKissCut === null || file.unitLengthInMm_DieKissCut === undefined || file.unitLengthInMm_DieKissCut === "") missing.push(t("materials.dieCutAnalyzer.table.unitLength") || "Unit Length");
        if (file.columnsAmount_DieKissCut === null || file.columnsAmount_DieKissCut === undefined || file.columnsAmount_DieKissCut === "") missing.push(t("materials.dieCutAnalyzer.table.columnsAmount") || "Columns Amount");
        if (file.rowsAmount_DieKissCut === null || file.rowsAmount_DieKissCut === undefined || file.rowsAmount_DieKissCut === "") missing.push(t("materials.dieCutAnalyzer.table.rowsAmount") || "Rows Amount");
        if (file.spaceBetweenColumnsInMm_DieKissCut === null || file.spaceBetweenColumnsInMm_DieKissCut === undefined || file.spaceBetweenColumnsInMm_DieKissCut === "") missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenColumns") || "Space Between Columns");
        if (file.spaceBetweenRowsInMm_DieKissCut === null || file.spaceBetweenRowsInMm_DieKissCut === undefined || file.spaceBetweenRowsInMm_DieKissCut === "") missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenRows") || "Space Between Rows");
        if (!file.directions || file.directions === "" || file.directions === null) missing.push(t("materials.dieCutAnalyzer.table.directions") || "Directions");
        if (file.defaultCost_DieKissCut === null || file.defaultCost_DieKissCut === undefined || file.defaultCost_DieKissCut === "") missing.push(t("materials.dieCutAnalyzer.table.defaultCost") || "Default Cost");
        if (!file.currency_DieKissCut || file.currency_DieKissCut === "" || file.currency_DieKissCut === null) missing.push(t("materials.dieCutAnalyzer.table.currency") || "Currency");
      } else {
        // DieCut - validate required fields
        if (!file.shape || file.shape === "" || file.shape === null) missing.push(t("materials.dieCutAnalyzer.table.shape") || "Shape");
        if (!file.name || file.name === "" || file.name === null) missing.push(t("materials.dieCutAnalyzer.table.name") || "Name");
        if (file.dieCutFormWidthInCm === null || file.dieCutFormWidthInCm === undefined || file.dieCutFormWidthInCm === "") missing.push(t("materials.dieCutAnalyzer.table.dieUnitWidth") || "Die Unit Width");
        if (file.dieCutFormLengthInCm === null || file.dieCutFormLengthInCm === undefined || file.dieCutFormLengthInCm === "") missing.push(t("materials.dieCutAnalyzer.table.dieUnitLength") || "Die Unit Length");
        if (file.columnsAmount === null || file.columnsAmount === undefined || file.columnsAmount === "") missing.push(t("materials.dieCutAnalyzer.table.columnsAmount") || "Columns Amount");
        if (file.rowsAmount === null || file.rowsAmount === undefined || file.rowsAmount === "") missing.push(t("materials.dieCutAnalyzer.table.rowsAmount") || "Rows Amount");
        if (file.spaceBetweenColumnsInMm === null || file.spaceBetweenColumnsInMm === undefined || file.spaceBetweenColumnsInMm === "") missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenColumns") || "Space Between Columns");
        if (file.spaceBetweenRowsInMm === null || file.spaceBetweenRowsInMm === undefined || file.spaceBetweenRowsInMm === "") missing.push(t("materials.dieCutAnalyzer.table.spaceBetweenRows") || "Space Between Rows");
        if (!file.directions || file.directions === "" || file.directions === null) missing.push(t("materials.dieCutAnalyzer.table.directions") || "Directions");
        if (file.defaultCost === null || file.defaultCost === undefined || file.defaultCost === "") missing.push(t("materials.dieCutAnalyzer.table.defaultCost") || "Default Cost");
        if (!file.currency || file.currency === "" || file.currency === null) missing.push(t("materials.dieCutAnalyzer.table.currency") || "Currency");
      }

      if (missing.length > 0) {
        console.log("missing", { missing, file });
        missingFields.push({ fileName: "", fields: missing });
      }
    });

    // Show error if any required fields are missing
    if (missingFields.length > 0) {
      const errorMessages = missingFields.map(
        (item) => `${item.fields.join(", ")}`
      );
      console.log("errorMessages", errorMessages);
      alertFault(
        "Please fill all required fields:" + errorMessages.join("\n")
      );
      return;
    }

    // Prepare payload - transform each completed file to the API format
    const payload = completedFiles.map((file) => {
      const image = file.base64;
      // Build rowData object based on materialType
      let rowData: any = {};

      if (file.materialType === "DieKissCut") {
        rowData = {
          unitWidth: file.unitWidthInMm_DieKissCut.toString(),
          unitLength: file.unitLengthInMm_DieKissCut.toString(),
          "columns amount": file.columnsAmount_DieKissCut.toString(),
          "lines amount": file.rowsAmount_DieKissCut.toString(),
          "space between columns": file.spaceBetweenColumnsInMm_DieKissCut.toString(),
          "space between lines": file.spaceBetweenRowsInMm_DieKissCut.toString(),
          directions: file.directions,
          unitPrice: file.defaultCost_DieKissCut.toString(),
          currency: file.currency_DieKissCut,
          shape: file.shape,
          name: file.name_DieKissCut,
          code: file.code_DieKissCut,
          "Active": "false",
          "image": `data:image/png;base64,${image}`,
          isOutSource: "false",

        };
      } else {
        // DieCut
        rowData = {
          shape: file.shape,
          width: file.widthInCm,
          length: file.lengthInCm,
          unitWidth: file.dieCutFormWidthInCm,
          unitLength: file.dieCutFormLengthInCm,
          finalUnitWidth: file.finalProductWidthInCm,
          finalUnitLength: file.finalProductLengthInCm,
          finalUnitHeight: file.finalProductHeightInCm,
          columnsAmount: file.columnsAmount,
          linesAmount: file.rowsAmount,
          spaceBetweenColumns: file.spaceBetweenColumnsInMm,
          spaceBetweenLines: file.spaceBetweenRowsInMm,
          cuttingLineLength: file.cuttingLineLengthInCm,
          scoringLineLength: file.scoringLineLengthInCm,
          perforationLineLength: file.perforationLineLengthInCm,
          price: file.defaultCost,
          currency: file.currency,
        };
      }

      return {
        materialKey,
        categoryKey,
        rowData,
      };
    });

    const callBack = async (res: any) => {
      if (res?.success) {
        alertSuccess(res?.message);
        handleRefreshMaterialData();
        onClose();
        setUploadedFiles([]);

      } else {
        alertFault(res?.message || t("materials.dieCutAnalyzer.addMaterialsFailed") || "Failed to add materials");
      }
    };

    await addPrintHouseMaterialsRowsApi(callApi, callBack, payload);
  }, [uploadedFiles, callApi, alertFault, alertSuccessAdded, t, query, supplierId, onClose, pageNumber, suppliersIds, activeFilter, materialKey, categoryKey, setMaterialCategoryData]);

  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

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

  const getStatusColor = (status: string) => {
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
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready":
        return t("materials.dieCutAnalyzer.status.ready") || "Ready";
      case "analyzing":
        return t("materials.dieCutAnalyzer.status.analyzing") || "Analyzing";
      case "completed":
        return t("materials.dieCutAnalyzer.status.completed") || "Completed";
      case "error":
        return t("materials.dieCutAnalyzer.status.error") || "Error";
      default:
        return status;
    }
  };

  const readyFilesCount = uploadedFiles.filter((f) => f.status === "ready").length;
  const completedFilesCount = uploadedFiles.filter((f) => f.status === "completed").length;
  // Enable "Add Materials" only when all files are analyzed (no "ready" status) and at least one is completed
  const canAddMaterials = readyFilesCount === 0 && completedFilesCount > 0;

  // Helper function to get display value
  const getDisplayValue = (value: any) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return value;
  };

  // Helper function to get the correct field value based on materialType
  const getFieldValue = (file: UploadedFile, dieCutField: keyof UploadedFile, dieKissCutField: keyof UploadedFile) => {
    if (file.materialType === "DieKissCut") {
      return getDisplayValue(file[dieKissCutField]);
    } else {
      return getDisplayValue(file[dieCutField]);
    }
  };

  // Helper function to render editable cell
  const renderEditableCell = (
    file: UploadedFile,
    field: keyof UploadedFile,
    type: "text" | "number" = "text",
    options?: any[]
  ) => {
    const value = file[field] ?? "";
    const isEditable = file.status === "completed";

    if (!isEditable) {
      return getDisplayValue(value);
    }

    if (options && options.length > 0) {
      // For dropdown fields (currency, directions)
      const selectedOption = options.find((opt: any) => opt.value === value || opt.label === value);
      return (
        <GoMakeAutoComplate
          value={selectedOption || null}
          options={options}
          onChange={(e: any, newValue: any) => {
            handleUpdateFileField(file.id, field, newValue?.value || newValue?.label || "");
          }}
          getOptionLabel={(option: any) => option.label || option.value || ""}
          style={{ width: "100%", minWidth: "120px" }}
        />
      );
    }

    return (
      <TextField
        type={type}
        value={value}
        onChange={(e) => {
          const newValue = type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
          handleUpdateFileField(file.id, field, newValue);
        }}
        size="small"
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            height: "32px",
            fontSize: "14px",
          },
        }}
        inputProps={{
          style: {
            padding: "6px 8px",
          },
        }}
      />
    );
  };

  // Get table columns based on materialType
  const getTableColumns = (materialType?: string) => {
    if (materialType === "DieKissCut") {
      return [
        { key: "code_DieKissCut", label: t("materials.dieCutAnalyzer.table.code") || "Code", type: "text", materialType: "DieKissCut" },
        { key: "shape", label: t("materials.dieCutAnalyzer.table.shape") || "Shape", type: "text", materialType: "DieKissCut" },
        { key: "name_DieKissCut", label: t("materials.dieCutAnalyzer.table.name") || "Name", type: "text", materialType: "DieKissCut" },
        { key: "unitWidthInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.unitWidth"), type: "number", materialType: "DieKissCut" },
        { key: "unitLengthInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.unitLength") || "Unit Length (MM)", type: "number", materialType: "DieKissCut" },
        { key: "columnsAmount_DieKissCut", label: t("materials.dieCutAnalyzer.table.columnsAmount") || "Columns Amount", type: "number", materialType: "DieKissCut" },
        { key: "rowsAmount_DieKissCut", label: t("materials.dieCutAnalyzer.table.rowsAmount") || "Rows Amount", type: "number", materialType: "DieKissCut" },
        { key: "spaceBetweenColumnsInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.spaceBetweenColumns") || "Space Between Columns (MM)", type: "number", materialType: "DieKissCut" },
        { key: "spaceBetweenRowsInMm_DieKissCut", label: t("materials.dieCutAnalyzer.table.spaceBetweenLines") || "Space Between Lines (MM)", type: "number", materialType: "DieKissCut" },
        { key: "directions", label: t("materials.dieCutAnalyzer.table.directions") || "Directions", type: "text", materialType: "DieKissCut" },
        { key: "defaultCost_DieKissCut", label: t("materials.dieCutAnalyzer.table.defaultCost") || "Default Cost", type: "number", materialType: "DieKissCut" },
        { key: "currency_DieKissCut", label: t("materials.dieCutAnalyzer.table.currency") || "Currency", type: "text", options: currencies, materialType: "DieKissCut" },
      ];
    } else {
      // DieCut columns
      return [
        { key: "shape", label: t("materials.dieCutAnalyzer.table.shape") || "Shape", type: "text", materialType: "DieCut" },
        { key: "widthInCm", label: t("materials.dieCutAnalyzer.table.width") || "Width (CM)", type: "number", materialType: "DieCut" },
        { key: "lengthInCm", label: t("materials.dieCutAnalyzer.table.length") || "Length (CM)", type: "number", materialType: "DieCut" },
        { key: "dieCutFormWidthInCm", label: t("materials.dieCutAnalyzer.table.dieUnitWidth") || "Die Unit Width (CM)", type: "number", materialType: "DieCut" },
        { key: "dieCutFormLengthInCm", label: t("materials.dieCutAnalyzer.table.dieUnitLength") || "Die Unit Length (CM)", type: "number", materialType: "DieCut" },
        { key: "finalProductWidthInCm", label: t("materials.dieCutAnalyzer.table.finalUnitWidth") || "Final Unit Width (CM)", type: "number", materialType: "DieCut" },
        { key: "finalProductLengthInCm", label: t("materials.dieCutAnalyzer.table.finalUnitLength") || "Final Unit Length (CM)", type: "number", materialType: "DieCut" },
        { key: "finalProductHeightInCm", label: t("materials.dieCutAnalyzer.table.finalUnitHeight") || "Final Unit Height (CM)", type: "number", materialType: "DieCut" },
        { key: "columnsAmount", label: t("materials.dieCutAnalyzer.table.columnsAmount") || "Columns Amount", type: "number", materialType: "DieCut" },
        { key: "rowsAmount", label: t("materials.dieCutAnalyzer.table.rowsAmount") || "Rows Amount", type: "number", materialType: "DieCut" },
        { key: "spaceBetweenColumnsInMm", label: t("materials.dieCutAnalyzer.table.spaceBetweenColumns") || "Space Between Columns (MM)", type: "number", materialType: "DieCut" },
        { key: "spaceBetweenRowsInMm", label: t("materials.dieCutAnalyzer.table.spaceBetweenLines") || "Space Between Lines (MM)", type: "number", materialType: "DieCut" },
        { key: "cuttingLineLengthInCm", label: t("materials.dieCutAnalyzer.table.cuttingLineLength") || "Cutting Line Length (CM)", type: "number", materialType: "DieCut" },
        { key: "scoringLineLengthInCm", label: t("materials.dieCutAnalyzer.table.scoringLineLength") || "Scoring Line Length (CM)", type: "number", materialType: "DieCut" },
        { key: "perforationLineLengthInCm", label: t("materials.dieCutAnalyzer.table.perforationLineLength") || "Perforation Line Length (CM)", type: "number", materialType: "DieCut" },
        { key: "defaultCost", label: t("materials.dieCutAnalyzer.table.defaultCost") || "Default Cost", type: "number", materialType: "DieCut" },
        { key: "currency", label: t("materials.dieCutAnalyzer.table.currency") || "Currency", type: "text", options: currencies, materialType: "DieCut" },
      ];
    }
  };

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("materials.dieCutAnalyzer.title") || "Die-Cut Analyzer"}
      maxWidth="xl"
      fullWidth
      showFooter={false}
    >
      <Stack gap={3}>

        {/* Upload Area */}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: `2px dashed ${isDragging ? primaryColor(500) : neutralColor(300)}`,
            borderRadius: "8px",
            padding: "40px 20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragging ? primaryColor(50) : neutralColor(50),
            transition: "all 0.3s ease",
            marginTop: "10px",
            "&:hover": {
              borderColor: primaryColor(500),
              backgroundColor: primaryColor(50),
            },
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: primaryColor(500),
              marginBottom: 2,
            }}
          />
          <Typography
            variant="body1"
            sx={{
              ...FONT_FAMILY.Lexend(500, 16),
              color: primaryColor(500),
              marginBottom: 1,
            }}
          >
            <span style={{ color: primaryColor(500) }}>
              {t("materials.dieCutAnalyzer.uploadFiles") || "Upload files"}
            </span>{" "}
            {t("materials.dieCutAnalyzer.orDragAndDrop") || "or drag and drop"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: neutralColor(600),
              ...FONT_FAMILY.Lexend(400, 12),
            }}
          >
            {t("materials.dieCutAnalyzer.fileTypes") || "PNG, JPG, PDF up to 10MB"}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            multiple
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
        </Box>

        {/* Action Buttons */}
        {uploadedFiles.length > 0 && (
          <Stack
            direction="row"
            gap={2}
            justifyContent="flex-start"
            sx={{
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <Button
              variant="contained"
              onClick={handleAnalyze}
              disabled={readyFilesCount === 0}
              sx={{
                backgroundColor: primaryColor(500),
                color: "white",
                "&:hover": {
                  backgroundColor: primaryColor(600),
                },
                "&:disabled": {
                  backgroundColor: neutralColor(300),
                  color: neutralColor(500),
                },
              }}
            >
              {t("materials.dieCutAnalyzer.analyzeFiles", { count: readyFilesCount }) ||
                `Analyze ${readyFilesCount} Files`}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleAddMaterials}
              disabled={!canAddMaterials}
              sx={{
                borderColor: neutralColor(300),
                color: neutralColor(700),
                "&:hover": {
                  borderColor: primaryColor(500),
                  backgroundColor: primaryColor(50),
                },
                "&:disabled": {
                  borderColor: neutralColor(200),
                  color: neutralColor(400),
                  backgroundColor: neutralColor(50),
                },
              }}
            >
              {t("materials.dieCutAnalyzer.addMaterials") || "Add Materials"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleClearAll}
              sx={{
                borderColor: "#F44336",
                color: "#F44336",
                marginLeft: isRTL ? 0 : "auto",
                marginRight: isRTL ? "auto" : 0,
                "&:hover": {
                  borderColor: "#D32F2F",
                  backgroundColor: "#FFEBEE",
                },
              }}
            >
              {t("materials.dieCutAnalyzer.clearAll") || "Clear All"}
            </Button>
          </Stack>
        )}

        {/* Files Table */}
        {uploadedFiles.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 400,
              width: "100%",
              overflowX: "auto",
              overflowY: "auto",
            }}
          >
            <Table stickyHeader sx={{ minWidth: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.file") || "FILE"}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.status") || "STATUS"}
                  </TableCell>
                  {(() => {
                    // Determine which columns to show based on first completed file's materialType
                    // If no completed files, show DieCut columns by default
                    const completedFiles = uploadedFiles.filter((f) => f.status === "completed");
                    const firstCompletedFile = completedFiles[0];
                    const materialTypeToShow = firstCompletedFile?.materialType || query?.materialType?.toString() || "DieCut";
                    const columnsToShow = getTableColumns(materialTypeToShow);
                    return columnsToShow.map((column) => (
                      <TableCell
                        key={column.key}
                        sx={{
                          backgroundColor: primaryColor(50),
                          color: primaryColor(900),
                          ...FONT_FAMILY.Lexend(500, 14),
                          width: "100%",
                          minWidth: "200px",
                          textAlign: "start",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ));
                  })()}
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.actions") || "ACTIONS"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedFiles.map((file) => {
                  // Get columns based on file's own materialType, or first completed file's materialType, or default to DieCut
                  const completedFiles = uploadedFiles.filter((f) => f.status === "completed");
                  const firstCompletedFile = completedFiles[0];
                  const materialTypeToShow = file.materialType || firstCompletedFile?.materialType || query?.materialType?.toString() || "DieCut";
                  const columnsToShow = getTableColumns(materialTypeToShow);
                  console.log("columnsToShow", { columnsToShow, file });

                  return (
                    <TableRow key={file.id}>
                      <TableCell
                        sx={{
                          ...FONT_FAMILY.Lexend(400, 14),
                          color: neutralColor(700),
                          minWidth: 200,
                          whiteSpace: "nowrap",
                          textAlign: "start",
                        }}
                      >
                        {file.fileName}
                      </TableCell>
                      <TableCell
                        sx={{
                          minWidth: 120,
                          whiteSpace: "nowrap",
                          textAlign: "start",
                        }}
                      >
                        {file.status === "analyzing" ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                              backgroundColor: getStatusColor(file.status),
                              color: "white",
                              padding: "4px 12px",
                              borderRadius: "16px",
                              ...FONT_FAMILY.Lexend(500, 12),
                            }}
                          >
                            <CircularProgress
                              size={14}
                              thickness={4}
                              sx={{
                                color: "white",
                              }}
                            />
                            <span>{getStatusLabel(file.status)}</span>
                          </Box>
                        ) : (
                          <Chip
                            label={getStatusLabel(file.status)}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(file.status),
                              color: "white",
                              ...FONT_FAMILY.Lexend(500, 12),
                            }}
                          />
                        )}
                      </TableCell>
                      {columnsToShow.map((column) => {
                        // Get value from file
                        const cellValue = file[column.key as keyof UploadedFile];
                        console.log("aaqqqq", { cellValue, column });

                        return (
                          <TableCell
                            key={column.key}
                            sx={{
                              ...FONT_FAMILY.Lexend(400, 14),
                              color: neutralColor(700),
                              padding: file.status === "completed" ? "4px 8px" : "8px",
                              minWidth: 120,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.status === "completed" && cellValue !== undefined
                              ? renderEditableCell(file, column.key as keyof UploadedFile, column.type as "text" | "number", column.options)
                              : getDisplayValue(cellValue)}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        sx={{
                          minWidth: 100,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleRemoveFile(file.id)}
                          sx={{
                            color: "#F44336",
                            minWidth: "auto",
                            padding: "4px 8px",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </GoMakeDialog>
  );
};

export { DieCutAnalyzerDialog };
