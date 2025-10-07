import React, { useState } from "react";
import { Box, Stack, Typography, Checkbox, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { GoMakeModal } from "@/components/modal/modal";
import { GomakePrimaryButton } from "@/components/button";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useStyle } from "./style";

interface IDuplicatesModalProps {
    openModal: boolean;
    onClose: () => void;
    data: any[];
    onDelete: (selectedIds: string[]) => void;
}

const DuplicatesModal: React.FC<IDuplicatesModalProps> = ({
    openModal,
    onClose,
    data,
    onDelete,
}) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());

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
        }
        onClose();
    };

    const handleCancel = () => {
        setSelectedMaterials(new Set());
        onClose();
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
                displayValue = field.value ? t("general.yes") : t("general.no");
            }

            cells.push({
                key,
                value: displayValue,
            });
        });

        return cells;
    };

    const getTableHeaders = (materials: any[]) => {
        if (!materials || materials.length === 0) return [];

        const firstMaterial = materials[0];
        const rowData = firstMaterial.rowData || {};

        return Object.keys(rowData).map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
        }));
    };

    return (
        <GoMakeModal
            openModal={openModal}
            onClose={handleCancel}
            modalTitle={t("materials.childTable.duplicatesModal.title")}
            insideStyle={{ width: "90%", maxWidth: "1400px", height: "auto", maxHeight: "90vh" }}
        >
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
                                                <Box sx={classes.deletedHeader}>
                                                    <Typography variant="subtitle1" sx={classes.sectionTitle}>
                                                        {t("materials.childTable.duplicatesModal.duplicatedMaterials")}
                                                    </Typography>
                                                    <Box sx={classes.selectAllContainer}>
                                                        <Checkbox
                                                            checked={category.printHouseMaterialDuplicated.every((m: any) => selectedMaterials.has(m.id))}
                                                            indeterminate={
                                                                category.printHouseMaterialDuplicated.some((m: any) => selectedMaterials.has(m.id)) &&
                                                                !category.printHouseMaterialDuplicated.every((m: any) => selectedMaterials.has(m.id))
                                                            }
                                                            onChange={() => handleSelectAllInCategory(category.printHouseMaterialDuplicated)}
                                                        />
                                                        <Typography variant="body2">
                                                            {t("materials.childTable.duplicatesModal.selectAll")}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <TableContainer component={Paper} sx={classes.tableContainer}>
                                                    <Table stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={classes.headerCell}>
                                                                    {t("materials.childTable.duplicatesModal.select")}
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
                                            </Box>
                                        )}

                                        {/* Deleted Materials Table */}
                                        {category.printHouseMaterialDeleted && category.printHouseMaterialDeleted.length > 0 && (
                                            <Box>
                                                <Box sx={classes.deletedHeader}>
                                                    <Typography variant="subtitle1" sx={classes.sectionTitle}>
                                                        {t("materials.childTable.duplicatesModal.deletedMaterials")}
                                                    </Typography>
                                                    <Box sx={classes.selectAllContainer}>
                                                        <Checkbox
                                                            checked={category.printHouseMaterialDeleted.every((m: any) => selectedMaterials.has(m.id))}
                                                            indeterminate={
                                                                category.printHouseMaterialDeleted.some((m: any) => selectedMaterials.has(m.id)) &&
                                                                !category.printHouseMaterialDeleted.every((m: any) => selectedMaterials.has(m.id))
                                                            }
                                                            onChange={() => handleSelectAllInCategory(category.printHouseMaterialDeleted)}
                                                        />
                                                        <Typography variant="body2">
                                                            {t("materials.childTable.duplicatesModal.selectAll")}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <TableContainer component={Paper} sx={classes.tableContainer}>
                                                    <Table stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={classes.headerCell}>
                                                                    {t("materials.childTable.duplicatesModal.select")}
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

                {/* Action Buttons */}
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

