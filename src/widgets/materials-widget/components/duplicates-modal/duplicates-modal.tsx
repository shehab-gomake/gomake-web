import React, { useState, useRef, useEffect } from "react";
import { Box, Stack, Typography, Checkbox, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import { GoMakeModal } from "@/components/modal/modal";
import { GomakePrimaryButton } from "@/components/button";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";
import { useStyle } from "./style";

interface IDuplicatesModalProps {
    openModal: boolean;
    onClose: () => void;
    data: any[];
    onDelete: (selectedIds: string[]) => void;
    materialHeaders: { key: string; value: string; unit?: string; isShowInExtraParameters?: boolean; isForAdmin?: boolean }[];
    onRefreshData: () => void;
}

const DuplicatesModal: React.FC<IDuplicatesModalProps> = ({
    openModal,
    onClose,
    data,
    onDelete,
    materialHeaders,
    onRefreshData,
}) => {
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const isRTL = dir === "rtl";
    const { classes } = useStyle();
    const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
    const [showScrollIndicators, setShowScrollIndicators] = useState<{ [key: string]: boolean }>({});

    const handleToggleSelection = (materialId: string) => {
        const newSelection = new Set(selectedMaterials);
        if (newSelection.has(materialId)) {
            newSelection.delete(materialId);
        } else {
            newSelection.add(materialId);
        }
        setSelectedMaterials(newSelection);
    };

    const handleSelectAllInCategory = (materials: any[]) => {
        const newSelection = new Set(selectedMaterials);
        const allSelected = materials.every(m => newSelection.has(m.id));

        if (allSelected) {
            materials.forEach(m => newSelection.delete(m.id));
        } else {
            materials.forEach(m => newSelection.add(m.id));
        }
        setSelectedMaterials(newSelection);
    };

    const handleDelete = () => {
        if (selectedMaterials.size > 0) {
            onDelete(Array.from(selectedMaterials));
        } else {
            onClose();
        }
        // Don't call onRefreshData here - it will be called after successful deletion
    };

    const handleCancel = () => {
        setSelectedMaterials(new Set());
        onClose();
        // Refresh data after cancel
        onRefreshData();
    };

    const renderMaterialRow = (material: any) => {
        const rowData = material.rowData || {};
        const cells: any[] = [];

        // Extract key fields from rowData
        Object.keys(rowData).forEach((key) => {
            const field = rowData[key];
            let displayValue = field.value;

            // Handle boolean values
            if (typeof field.value === 'boolean') {
                displayValue = field.value ? t("modal.yes") : t("modal.no");
            }

            cells.push({
                key,
                value: displayValue,
            });
        });

        return cells;
    };

    const getTableHeaders = (materials: any[]) => {
        if (!materials || materials.length === 0 || !materialHeaders) return [];

        const firstMaterial = materials[0];
        const rowDataKeys = Object.keys(firstMaterial.rowData || {});

        // Filter materialHeaders to only include keys that exist in rowData
        // and exclude extra parameters and admin-only fields
        const filteredHeaders = materialHeaders
            .filter(header =>
                rowDataKeys.includes(header.key) &&
                !header.isShowInExtraParameters
            )
            .map(header => ({
                key: header.key,
                label: header.unit ? `${header.value} (${header.unit})` : header.value,
                unit: header.unit,
            }));

        return filteredHeaders;
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>, tableId: string) => {
        const container = e.currentTarget;
        const { scrollLeft, scrollWidth, clientWidth } = container;

        let isAtEnd;
        if (isRTL) {
            const maxScrollLeft = scrollWidth - clientWidth;
            isAtEnd = Math.abs(scrollLeft) >= maxScrollLeft - 5;
        } else {
            isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;
        }

        setShowScrollIndicators(prev => ({
            ...prev,
            [tableId]: !isAtEnd
        }));
    };

    const scrollToRight = (tableId: string) => {
        const container = document.getElementById(tableId);
        if (container) {
            if (isRTL) {
                const maxScrollLeft = container.scrollWidth - container.clientWidth;
                container.scrollTo({
                    left: -maxScrollLeft,
                    behavior: 'smooth'
                });
            } else {
                container.scrollTo({
                    left: container.scrollWidth,
                    behavior: 'smooth'
                });
            }
        }
    };

    useEffect(() => {
        // Check initial scroll state for all tables
        if (data && data.length > 0) {
            data.forEach((category, index) => {
                if (category.printHouseMaterialDuplicated?.length > 0) {
                    const tableId = `duplicated-table-${index}`;
                    const container = document.getElementById(tableId);
                    if (container) {
                        const { scrollWidth, clientWidth } = container;
                        setShowScrollIndicators(prev => ({
                            ...prev,
                            [tableId]: scrollWidth > clientWidth
                        }));
                    }
                }
                if (category.printHouseMaterialDeleted?.length > 0) {
                    const tableId = `deleted-table-${index}`;
                    const container = document.getElementById(tableId);
                    if (container) {
                        const { scrollWidth, clientWidth } = container;
                        setShowScrollIndicators(prev => ({
                            ...prev,
                            [tableId]: scrollWidth > clientWidth
                        }));
                    }
                }
            });
        }
    }, [data]);

    return (
        <GoMakeModal
            openModal={openModal}
            onClose={handleCancel}
            modalTitle={t("materials.childTable.duplicatesModal.title")}
            insideStyle={{ width: "90%", maxWidth: "1400px", height: "80vh", display: "flex", flexDirection: "column", padding: 10 }}
        >
            <Box sx={classes.modalContent}>
                <Box sx={classes.container}>
                    <Stack gap={2}>
                        {data && data.length > 0 ? (
                            data.map((category, index) => (
                                <Accordion key={index} defaultExpanded={index === 0}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={classes.accordionSummary}
                                    >
                                        <Typography variant="h6" sx={classes.categoryTitle}>
                                            {t("materials.childTable.duplicatesModal.category")}: {category.categoryKey}
                                        </Typography>
                                        <Box sx={classes.badgeContainer}>
                                            {category.printHouseMaterialDuplicated && category.printHouseMaterialDuplicated.length > 0 && (
                                                <Box sx={classes.badge}>
                                                    {t("materials.childTable.duplicatesModal.duplicated")}: {category.printHouseMaterialDuplicated.length}
                                                </Box>
                                            )}
                                            {category.printHouseMaterialDeleted && category.printHouseMaterialDeleted.length > 0 && (
                                                <Box sx={{ ...classes.badge, ...classes.deletedBadge }}>
                                                    {t("materials.childTable.duplicatesModal.deleted")}: {category.printHouseMaterialDeleted.length}
                                                </Box>
                                            )}
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack gap={3}>
                                            {/* Duplicated Materials Table */}
                                            {category.printHouseMaterialDuplicated && category.printHouseMaterialDuplicated.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle1" sx={classes.sectionTitle}>
                                                        {t("materials.childTable.duplicatesModal.duplicatedMaterials")}
                                                    </Typography>
                                                    <Box sx={classes.tableContainerWrapper}>
                                                        <TableContainer
                                                            id={`duplicated-table-${index}`}
                                                            component={Paper}
                                                            sx={classes.tableContainer}
                                                            onScroll={(e) => handleScroll(e, `duplicated-table-${index}`)}
                                                        >
                                                            <Table stickyHeader>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell sx={classes.headerCell}>
                                                                            <Checkbox
                                                                                checked={category.printHouseMaterialDuplicated.every((m: any) => selectedMaterials.has(m.id))}
                                                                                indeterminate={
                                                                                    category.printHouseMaterialDuplicated.some((m: any) => selectedMaterials.has(m.id)) &&
                                                                                    !category.printHouseMaterialDuplicated.every((m: any) => selectedMaterials.has(m.id))
                                                                                }
                                                                                onChange={() => handleSelectAllInCategory(category.printHouseMaterialDuplicated)}
                                                                            />
                                                                        </TableCell>
                                                                        {getTableHeaders(category.printHouseMaterialDuplicated).map((header) => (
                                                                            <TableCell key={header.key} sx={classes.headerCell}>
                                                                                {header.label}
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {category.printHouseMaterialDuplicated.map((material: any) => {
                                                                        const cells = renderMaterialRow(material);
                                                                        const isSelected = selectedMaterials.has(material.id);
                                                                        return (
                                                                            <TableRow
                                                                                key={material.id}
                                                                                sx={{
                                                                                    ...classes.tableRow,
                                                                                    ...(isSelected && classes.selectedRow)
                                                                                }}
                                                                            >
                                                                                <TableCell sx={classes.tableCell}>
                                                                                    <Checkbox
                                                                                        checked={isSelected}
                                                                                        onChange={() => handleToggleSelection(material.id)}
                                                                                    />
                                                                                </TableCell>
                                                                                {cells.map((cell, cellIndex) => (
                                                                                    <TableCell key={`${material.id}-${cellIndex}`} sx={classes.tableCell}>
                                                                                        {cell.value}
                                                                                    </TableCell>
                                                                                ))}
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        {showScrollIndicators[`duplicated-table-${index}`] && (
                                                            <Tooltip title={t("materials.childTable.scrollToSeeMoreColumns")} arrow>
                                                                <IconButton
                                                                    onClick={() => scrollToRight(`duplicated-table-${index}`)}
                                                                    sx={classes.scrollIndicatorButton}
                                                                >
                                                                    {isRTL ? <ChevronLeft /> : <ChevronRight />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Deleted Materials Table */}
                                            {category.printHouseMaterialDeleted && category.printHouseMaterialDeleted.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle1" sx={classes.sectionTitle}>
                                                        {t("materials.childTable.duplicatesModal.deletedMaterials")}
                                                    </Typography>
                                                    <Box sx={classes.tableContainerWrapper}>
                                                        <TableContainer
                                                            id={`deleted-table-${index}`}
                                                            component={Paper}
                                                            sx={classes.tableContainer}
                                                            onScroll={(e) => handleScroll(e, `deleted-table-${index}`)}
                                                        >
                                                            <Table stickyHeader>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell sx={classes.headerCell}>
                                                                            <Checkbox
                                                                                checked={category.printHouseMaterialDeleted.every((m: any) => selectedMaterials.has(m.id))}
                                                                                indeterminate={
                                                                                    category.printHouseMaterialDeleted.some((m: any) => selectedMaterials.has(m.id)) &&
                                                                                    !category.printHouseMaterialDeleted.every((m: any) => selectedMaterials.has(m.id))
                                                                                }
                                                                                onChange={() => handleSelectAllInCategory(category.printHouseMaterialDeleted)}
                                                                            />
                                                                        </TableCell>
                                                                        {getTableHeaders(category.printHouseMaterialDeleted).map((header) => (
                                                                            <TableCell key={header.key} sx={classes.headerCell}>
                                                                                {header.label}
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {category.printHouseMaterialDeleted.map((material: any) => {
                                                                        const cells = renderMaterialRow(material);
                                                                        const isSelected = selectedMaterials.has(material.id);
                                                                        return (
                                                                            <TableRow
                                                                                key={material.id}
                                                                                sx={{
                                                                                    ...classes.tableRow,
                                                                                    ...(isSelected && classes.selectedRow)
                                                                                }}
                                                                            >
                                                                                <TableCell sx={classes.tableCell}>
                                                                                    <Checkbox
                                                                                        checked={isSelected}
                                                                                        onChange={() => handleToggleSelection(material.id)}
                                                                                    />
                                                                                </TableCell>
                                                                                {cells.map((cell, cellIndex) => (
                                                                                    <TableCell key={`${material.id}-${cellIndex}`} sx={classes.tableCell}>
                                                                                        {cell.value}
                                                                                    </TableCell>
                                                                                ))}
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        {showScrollIndicators[`deleted-table-${index}`] && (
                                                            <Tooltip title={t("materials.childTable.scrollToSeeMoreColumns")} arrow>
                                                                <IconButton
                                                                    onClick={() => scrollToRight(`deleted-table-${index}`)}
                                                                    sx={classes.scrollIndicatorButton}
                                                                >
                                                                    {isRTL ? <ChevronLeft /> : <ChevronRight />}
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <Typography variant="body1" sx={classes.emptyState}>
                                {t("materials.childTable.duplicatesModal.noData")}
                            </Typography>
                        )}
                    </Stack>
                </Box>

                {/* Action Buttons - Fixed Footer */}
                <Box sx={classes.buttonsContainer}>
                    <GomakePrimaryButton
                        style={classes.cancelButton}
                        onClick={handleCancel}
                    >
                        {t("materials.childTable.duplicatesModal.cancel")}
                    </GomakePrimaryButton>
                    <GomakePrimaryButton
                        style={classes.deleteButton}
                        onClick={handleDelete}
                        disabled={selectedMaterials.size === 0}
                    >
                        {t("materials.childTable.duplicatesModal.deleteSelected")} ({selectedMaterials.size})
                    </GomakePrimaryButton>
                </Box>
            </Box>
        </GoMakeModal>
    );
};

export { DuplicatesModal };