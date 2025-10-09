import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Grid,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    openExtraParametersModalState,
    materialHeadersState,
} from "../../state";
import { useTranslation } from "react-i18next";
import { userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits } from "@/utils/helpers";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";
import { useTableCellData } from "../table-cell-data/use-table-cell-data";
import { ConfirmationDialogExample } from "@/components/dialog/example-usage";

interface IExtraParametersModalProps {
    isAdmin: boolean;
}

const ExtraParametersModal = ({ isAdmin }: IExtraParametersModalProps) => {
    const { t } = useTranslation();
    const [openExtraParametersModal, setOpenExtraParametersModal] =
        useRecoilState(openExtraParametersModalState);
    const materialHeaders = useRecoilValue(materialHeadersState);
    const user = useRecoilValue<any>(userState);
    const unitType = user?.printHouseProfile?.unitType || 0;
    const { updateCellData } = useTableCellData(isAdmin);

    // Local state to manage input values
    const [inputValues, setInputValues] = useState<Record<string, any>>({});
    // Store original values to compare on blur
    const [originalValues, setOriginalValues] = useState<Record<string, any>>({});

    const handleClose = () => {
        setOpenExtraParametersModal({ open: false });
        setInputValues({}); // Clear input values on close
        setOriginalValues({}); // Clear original values on close
    };

    // Filter headers to show only extra parameters
    const extraHeaders = useMemo(() => {
        return (isAdmin
            ? materialHeaders.filter((x) => x.isShowInExtraParameters)
            : materialHeaders.filter(
                (header) => header.isShowInExtraParameters
            ));
    }, [materialHeaders, isAdmin]);

    const rowData = openExtraParametersModal.rowData;

    // Initialize input values when modal opens or rowData changes
    React.useEffect(() => {
        if (rowData?.rowData) {
            const initialValues: Record<string, any> = {};
            extraHeaders.forEach((header) => {
                if (rowData.rowData[header.key]) {
                    initialValues[header.key] = rowData.rowData[header.key].value || '';
                }
            });
            setInputValues(initialValues);
            setOriginalValues(initialValues); // Store original values
        }
    }, [rowData, extraHeaders]);

    const handleInputChange = (key: string, value: any) => {
        setInputValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleInputBlur = async (key: string, value: any) => {
        // Only update if value has changed from original
        const originalValue = originalValues[key];
        if (rowData?.id && value !== originalValue) {
            try {
                await updateCellData(rowData.id, key, value);
                // Update original value after successful update
                setOriginalValues((prev) => ({
                    ...prev,
                    [key]: value,
                }));
            } catch (error) {
                console.error("Error updating cell data:", error);
                // Revert to original value on error
                setInputValues((prev) => ({
                    ...prev,
                    [key]: originalValue,
                }));
            }
        }
    };

    const renderInputField = (header: any, cellData: any) => {
        const convertedUnit =
            unitType === UNIT_TYPE.IMPERIAL
                ? convertTitleUnits(header.unit)
                : header.unit;

        const label = header.unit
            ? `${header.value} ${convertedUnit ? `(${t(`measurementUnits.${convertedUnit}`)})` : ''}`
            : header.value;

        const inputValue = inputValues[header.key] !== undefined
            ? inputValues[header.key]
            : (cellData?.value || '');

        return (
            <Box sx={{ mb: 1 }}>
                <Typography
                    variant="body2"
                    sx={{
                        // mb: 1,
                        fontWeight: 600,
                        color: "#333",
                        fontSize: "14px",
                    }}
                >
                    {label}
                </Typography>
                <GoMakeTextInput
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(header.key, e.target.value)
                    }
                    onBlur={() => handleInputBlur(header.key, inputValues[header.key])}
                    placeholder={label}
                    disabled={!isAdmin && header.isForAdmin}
                />
            </Box>
        );
    };

    return (
        <Dialog
            open={openExtraParametersModal.open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    maxHeight: "80vh",
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                    padding: "8px 16px",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Box sx={{ fontSize: "18px", fontWeight: 600, color: "#333" }}>
                    {t("materials.childTable.extraParameters.title")}
                </Box>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{
                        color: "#666",
                        "&:hover": {
                            backgroundColor: "#e0e0e0",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>


            <DialogContent sx={{ padding: "8px", backgroundColor: "#fafafa" }}>
                {extraHeaders.length > 0 && rowData ? (
                    <Grid container spacing={2} sx={{ overflow: "scroll", marginTop: "10px" }}>
                        {extraHeaders.map((header, index) => (
                            <Grid item key={index}>
                                {rowData.rowData && rowData.rowData[header.key] ? (
                                    renderInputField(header, rowData.rowData[header.key])
                                ) : (
                                    <Box >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                // mb: 1,
                                                fontWeight: 600,
                                                color: "#333",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {header.value}
                                        </Typography>
                                        <GoMakeTextInput
                                            value=""
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleInputChange(header.key, e.target.value)
                                            }
                                            onBlur={() => handleInputBlur(header.key, inputValues[header.key])}
                                            placeholder={header.value}
                                            disabled={!isAdmin && header.isForAdmin}
                                        />
                                    </Box>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#999",
                            fontSize: "14px",
                        }}
                    >
                        {t("materials.childTable.extraParameters.noData")}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export { ExtraParametersModal };
