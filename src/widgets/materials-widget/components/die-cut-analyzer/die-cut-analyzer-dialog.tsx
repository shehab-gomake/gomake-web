import React, { useEffect } from "react";
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
import { FONT_FAMILY } from "@/utils/font-family";
import { useRouter } from "next/router";
import { GoMakeAutoComplate } from "@/components";
import { useDieCutAnalyzer } from "./use-die-cut-analyzer";
import { UploadedFile } from "./use-die-cut-data-transform";

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
  const { query } = useRouter();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const {
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
  } = useDieCutAnalyzer(onClose);

  // Clear all data when modal closes
  useEffect(() => {
    if (!open) {
      clearAllData();
    }
  }, [open, clearAllData]);

  const renderEditableCell = (
    file: UploadedFile,
    field: keyof UploadedFile,
    column: { type: string; options?: any[]; placeholder?: string; isRequired?: boolean; unit?: string | null }
  ) => {
    const value = file[field];
    const isEditable = file.status === "completed";
    const { type, options, placeholder, isRequired, unit } = column;

    if (!isEditable) {
      return getDisplayValue(value);
    }

    // Handle null/undefined/empty values - show input field with empty value
    // For number types, convert 0 to empty string for display, but keep 0 as valid value
    const displayValue = value === null || value === undefined || value === ""
      ? ""
      : (type === "number" && value === 0 ? 0 : value);

    // Handle dropdown types (dropdown, currency, boolean with options)
    if ((type === "dropdown" || type === "currency" || (type === "boolean" && options && options.length > 0)) && options && options.length > 0) {
      // Match by key property first, then by value or label
      const selectedOption = options.find(
        (opt: any) => opt.key === value || opt.value === value || opt.label === value || opt.id === value
      );

      return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <GoMakeAutoComplate
            value={selectedOption || null}
            options={options}
            onChange={(e: any, newValue: any) => {
              // Save the key property if it exists, otherwise use value, label, or id
              const saveValue = newValue?.key ?? newValue?.value ?? newValue?.label ?? newValue?.id ?? "";
              handleUpdateFileField(file.id, field, saveValue);
            }}
            getOptionLabel={(option: any) => option.label || option.value || option.key || option.id || ""}
            placeholder={placeholder || ""}
            style={{ width: "100%", minWidth: "120px" }}
          />
        </Box>
      );
    }

    // Handle boolean type (checkbox or toggle)
    if (type === "boolean" && (!options || options.length === 0)) {
      const stringValue = String(value || "");
      const boolValue = stringValue === "true" || stringValue === "internal";
      return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <input
            type="checkbox"
            checked={boolValue}
            onChange={(e) => {
              const newValue = e.target.checked ? "internal" : "out source";
              handleUpdateFileField(file.id, field, newValue);
            }}
            style={{ cursor: "pointer" }}
          />
        </Box>
      );
    }

    // Handle number type
    if (type === "number") {
      return (
        <TextField
          type="number"
          value={displayValue}
          onChange={(e) => {
            const newValue = e.target.value === "" ? "" : Number(e.target.value);
            handleUpdateFileField(file.id, field, newValue);
          }}
          placeholder={placeholder || ""}
          required={isRequired}
          size="small"
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              height: "32px",
              fontSize: "14px",
              textAlign: "center",
            },
            "& .MuiInputBase-input": {
              textAlign: "center",
            },
          }}
          inputProps={{
            style: {
              padding: "6px 8px",
              textAlign: "center",
            },
          }}
        />
      );
    }

    // Handle text type (default)
    return (
      <TextField
        type="text"
        value={displayValue}
        onChange={(e) => {
          handleUpdateFileField(file.id, field, e.target.value);
        }}
        placeholder={placeholder || ""}
        required={isRequired}
        size="small"
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            height: "32px",
            fontSize: "14px",
            textAlign: "center",
          },
          "& .MuiInputBase-input": {
            textAlign: "center",
          },
        }}
        inputProps={{
          style: {
            padding: "6px 8px",
            textAlign: "center",
          },
        }}
      />
    );
  };

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("materials.dieCutAnalyzer.title")}
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
              {t("materials.dieCutAnalyzer.uploadFiles")}
            </span>{" "}
            {t("materials.dieCutAnalyzer.orDragAndDrop")}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: neutralColor(600),
              ...FONT_FAMILY.Lexend(400, 12),
            }}
          >
            {t("materials.dieCutAnalyzer.fileTypes")}
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
            justifyContent="space-between"
            sx={{
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <Stack direction="row" gap={2} sx={{
              flexDirection: isRTL ? "row-reverse" : "row",
            }}>
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
                startIcon={<div style={{ width: "12px", height: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: isRTL ? 0 : "16px", marginLeft: isRTL ? "16px" : 0 }}>
                  <DownloadIcon />
                </div>}
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
                {t("materials.dieCutAnalyzer.addMaterials")}
              </Button>
            </Stack>
            <Button
              variant="outlined"
              startIcon={<div style={{ width: "12px", height: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: isRTL ? 0 : "16px", marginLeft: isRTL ? "16px" : 0 }}>
                <DeleteIcon />
              </div>}
              onClick={handleClearAll}
              sx={{
                borderColor: "#F44336",
                color: "#F44336",
                "&:hover": {
                  borderColor: "#D32F2F",
                  backgroundColor: "#FFEBEE",
                },
              }}
            >
              {t("materials.dieCutAnalyzer.clearAll")}
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
              // Custom scrollbar styling for better visibility
              "&::-webkit-scrollbar": {
                height: "12px",
                width: "12px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: neutralColor(100),
                borderRadius: "6px",
                margin: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: primaryColor(400),
                borderRadius: "6px",
                border: `2px solid ${neutralColor(100)}`,
                "&:hover": {
                  backgroundColor: primaryColor(500),
                },
              },
              // Firefox scrollbar styling
              scrollbarWidth: "thin",
              scrollbarColor: `${primaryColor(400)} ${neutralColor(100)}`,
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
                      textAlign: "start",
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.file")}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                      textAlign: "start",
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.status")}
                  </TableCell>
                  {(() => {
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
                          minWidth: "200px",
                          width: "auto",
                          textAlign: "center",
                          padding: "12px 16px",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                          {column.label}
                          {column.isRequired && (
                            <Typography
                              component="span"
                              sx={{
                                color: "#F44336",
                                fontSize: "14px",
                                fontWeight: "bold",
                                marginLeft: "2px",
                              }}
                            >
                              *
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    ));
                  })()}
                  <TableCell
                    sx={{
                      backgroundColor: primaryColor(50),
                      color: primaryColor(900),
                      ...FONT_FAMILY.Lexend(500, 14),
                      textAlign: "start",
                    }}
                  >
                    {t("materials.dieCutAnalyzer.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadedFiles.map((file) => {
                  const completedFiles = uploadedFiles.filter((f) => f.status === "completed");
                  const firstCompletedFile = completedFiles[0];
                  const materialTypeToShow = file.materialType || firstCompletedFile?.materialType || query?.materialType?.toString() || "DieCut";
                  const columnsToShow = getTableColumns(materialTypeToShow);

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
                              backgroundColor: getStatusColor(file.status, primaryColor, neutralColor),
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
                              backgroundColor: getStatusColor(file.status, primaryColor, neutralColor),
                              color: "white",
                              ...FONT_FAMILY.Lexend(500, 12),
                            }}
                          />
                        )}
                      </TableCell>
                      {columnsToShow.map((column) => {
                        const cellValue = file[column.key as keyof UploadedFile];
                        return (
                          <TableCell
                            key={column.key}
                            sx={{
                              ...FONT_FAMILY.Lexend(400, 14),
                              color: neutralColor(700),
                              padding: file.status === "completed" ? "8px 16px" : "12px 16px",
                              minWidth: "200px",
                              width: "auto",
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.status === "completed"
                              ? renderEditableCell(file, column.key as keyof UploadedFile, column)
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
