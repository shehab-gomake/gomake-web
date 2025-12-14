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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { analyzeDieCutApi } from "@/services/api-service/materials/materials-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks";
import { FONT_FAMILY } from "@/utils/font-family";

interface UploadedFile {
  id: string;
  fileName: string;
  file: File;
  base64: string;
  status: "ready" | "analyzing" | "completed" | "error";
  unitWidthInMm?: number | string;
  unitLengthInMm?: number | string;
  columns?: number | string;
  rows?: number | string;
  columnSpaceInMm?: number | string;
  rowSpaceInMm?: number | string;
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
  const { alertSuccessAdded, alertFault } = useSnackBar();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Analyze each file
    const analyzePromises = readyFiles.map(async (file) => {
      const callBack = (res: any) => {
        if (res.success && res.data) {
          // Handle response data - API returns an array of results
          const responseData = res.data?.data || res.data;
          const resultsArray = Array.isArray(responseData) ? responseData : [responseData];

          // Find the result that matches the current file by fileName
          const fileResult = resultsArray.find(
            (result: any) => result?.fileName === file.fileName
          ) || resultsArray[0]; // Fallback to first result if fileName doesn't match

          if (fileResult) {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? {
                    ...f,
                    status: "completed",
                    unitWidthInMm: fileResult?.unitWidthInMm,
                    unitLengthInMm: fileResult?.unitLengthInMm,
                    columns: fileResult?.columns,
                    rows: fileResult?.rows,
                    columnSpaceInMm: fileResult?.columnSpaceInMm,
                    rowSpaceInMm: fileResult?.rowSpaceInMm,
                  }
                  : f
              )
            );
          } else {
            setUploadedFiles((prev) =>
              prev.map((f) => (f.id === file.id ? { ...f, status: "error" } : f))
            );
            alertFault(t("materials.dieCutAnalyzer.analysisFailed") || "Analysis failed - no result found");
          }
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, status: "error" } : f))
          );
          alertFault(res.message || t("materials.dieCutAnalyzer.analysisFailed") || "Analysis failed");
        }
      };

      await analyzeDieCutApi(callApi, callBack, {
        base64Image: file.base64,
        fileName: file.fileName,
      });
    });

    await Promise.all(analyzePromises);
    alertSuccessAdded();
  }, [uploadedFiles, callApi, alertFault, alertSuccessAdded, t]);

  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  const handleAddMaterials = useCallback(() => {
    // TODO: Implement add materials functionality
    alertFault(t("materials.dieCutAnalyzer.addMaterialsNotImplemented") || "Add materials functionality not yet implemented");
  }, [alertFault, t]);

  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
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

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("materials.dieCutAnalyzer.title") || "Die-Cut Analyzer"}
      maxWidth="lg"
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
              sx={{
                borderColor: neutralColor(300),
                color: neutralColor(700),
                "&:hover": {
                  borderColor: primaryColor(500),
                  backgroundColor: primaryColor(50),
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
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
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
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.unitWidth") || "UNIT WIDTH (MM)"}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.unitLength") || "UNIT LENGTH (MM)"}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.columns") || "COLUMNS"}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.rows") || "ROWS"}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.colSpace") || "COL. SPACE (MM)"}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.rowSpace") || "ROW SPACE (MM)"}
                  </TableCell>
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
                {uploadedFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell
                      sx={{
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: neutralColor(700),
                      }}
                    >
                      {file.fileName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(file.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(file.status),
                          color: "white",
                          ...FONT_FAMILY.Lexend(500, 12),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: neutralColor(700),
                      }}
                    >
                      {file.unitWidthInMm ?? "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: neutralColor(700),
                      }}
                    >
                      {file.unitLengthInMm ?? "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: neutralColor(700),
                      }}
                    >
                      {file.columns ?? "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: neutralColor(700),
                      }}
                    >
                      {file.rows ?? "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: neutralColor(700),
                      }}
                    >
                      {file.columnSpaceInMm ?? "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...FONT_FAMILY.Lexend(400, 14),
                        color: neutralColor(700),
                      }}
                    >
                      {file.rowSpaceInMm ?? "-"}
                    </TableCell>
                    <TableCell>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </GoMakeDialog>
  );
};

export { DieCutAnalyzerDialog };
