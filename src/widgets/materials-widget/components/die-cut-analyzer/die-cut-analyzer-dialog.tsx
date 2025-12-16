import React from "react";
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
  } = useDieCutAnalyzer(onClose);

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
