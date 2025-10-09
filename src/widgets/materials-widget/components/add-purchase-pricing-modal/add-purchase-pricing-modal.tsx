import React from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, IconButton } from "@mui/material";

import { GomakeTextInput, GomakePrimaryButton, GoMakeAutoComplate, } from "@/components";

import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE, } from "@/pages/customers/enums";
import { useRecoilState, useRecoilValue } from "recoil";
import { currenciesState } from "../../state";
import { Add as AddIcon } from "@mui/icons-material";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits } from "@/utils/helpers";
import { userState } from "@/store";





const AddPurchasePricingModal = ({
    isAddPurchasePricingModalOpen,
    handleCloseAddPurchasePricingModal,
    t,
    classes,
    selectedSupplierForPricing,
    handleSupplierSelectForPricing,
    renderOptionsSupplier,
    checkWhatRenderArraySupplier,
    isFetchingSupplier,
    formData,
    handleFormChange,
    handleAddPurchasePricing,
    purchasePricingTableHeadingUnits,
    setOpenSupplierModal,
}) => {
    const [currencies, setCurrencies] = useRecoilState<{ label: string; value: string }[]>(currenciesState);
    const user = useRecoilValue<any>(userState);
    const unitType = user?.printHouseProfile?.unitType || 0;

    const convertedPurchasePricingUnit =
        unitType === UNIT_TYPE.IMPERIAL
            ? convertTitleUnits(purchasePricingTableHeadingUnits.pricingUnit)
            : purchasePricingTableHeadingUnits.pricingUnit;

    const convertedPurchasePricingInventoryUnit =
        unitType === UNIT_TYPE.IMPERIAL
            ? convertTitleUnits(purchasePricingTableHeadingUnits.inventoryUnit)
            : purchasePricingTableHeadingUnits.inventoryUnit;

    return (
        <Dialog
            open={isAddPurchasePricingModalOpen}
            onClose={handleCloseAddPurchasePricingModal}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={classes.dialogTitle}>{t("materials.childTable.addPurchasePricing")}</DialogTitle>
            <DialogContent sx={classes.modalContent1}>
                <Box sx={classes.modalContent}>
                    <Box>
                        <div style={classes.modalLabelText}>{t("materials.childTable.supplier")}
                            <div style={{ color: "red" }}>*</div>
                            <Tooltip title={t("materials.sheetPaper.addNewSupplier")}>
                                <IconButton onClick={() => setOpenSupplierModal(true)}>
                                    <AddIcon sx={{ color: "#f50057" }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <ClientAutocomplete
                            key={selectedSupplierForPricing?.id}
                            clientType={CLIENT_TYPE.SUPPLIER}
                            onChange={handleSupplierSelectForPricing}
                            options={renderOptionsSupplier || []}
                            placeholder={t("materials.childTable.selectSupplier")}
                            style={{ width: '100%' }}
                            value={selectedSupplierForPricing}
                            onChangeTextField={checkWhatRenderArraySupplier}
                            loading={isFetchingSupplier}
                            getOptionLabel={(option: any) => `${option.name}`}
                            customStyle={{
                                borderBottom: "none",
                                borderRadius: '4px',
                            }}
                        />
                    </Box>

                    <div style={classes.modalInputContainer}>
                        <div style={classes.modalInputContainerItem}>
                            <div style={classes.modalLabelText2}>
                                {`${t("materials.childTable.purchasePrice")} ${convertedPurchasePricingUnit ? `( ${t(`measurementUnits.${convertedPurchasePricingUnit}`).split(' / ')[0]} )` : ''}`}
                                <div style={{ color: "red" }}>*</div>
                            </div>
                            <GomakeTextInput
                                value={formData?.purchasePrice}
                                onChange={(e) => handleFormChange('purchasePrice', e.target.value)}
                                type="number"
                                placeholder={t("materials.childTable.enterPurchaseRollPrice")}
                                style={{
                                    borderBottom: "none",
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={classes.modalInputContainerItem}>
                            <div style={classes.modalLabelText2}>
                                {t("materials.childTable.purchaseCurrency")}
                                <div style={{ color: "red" }}>*</div>
                            </div>
                            <GoMakeAutoComplate
                                value={formData.currency.value || undefined}
                                onChange={(e, value) => handleFormChange('currency', { value: value?.value, label: value?.label })}
                                options={currencies}
                                placeholder={t("materials.childTable.selectCurrency")}
                                style={{
                                    borderBottom: "none",
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>
                    <div style={classes.modalInputContainer}>
                        <div style={classes.modalInputContainerItem}>
                            <div style={classes.modalLabelText2}>
                                {`${t("materials.childTable.quantityInPackage")} ${convertedPurchasePricingInventoryUnit ? `(${t(`measurementUnits.${convertedPurchasePricingInventoryUnit}`)})` : ''}`}
                                <div style={{ color: "red" }}>*</div>
                            </div>
                            <GomakeTextInput
                                value={formData.quantityInPackage}
                                onChange={(e) => handleFormChange('quantityInPackage', e.target.value)}
                                type="number"
                                placeholder={t("materials.childTable.enterQuantity")}
                                style={{
                                    borderBottom: "none",
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={classes.modalInputContainerItem}>
                            <div style={classes.modalLabelText2}>
                                {t("materials.childTable.supplementTimeWorkingDays")}
                            </div>
                            <GomakeTextInput
                                value={formData.supplementTime}
                                onChange={(e) => handleFormChange('supplementTime', e.target.value)}
                                type="number"
                                placeholder={t("materials.childTable.enterSupplementTime")}
                                style={{
                                    borderBottom: "none",
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>



                </Box>
            </DialogContent>
            <DialogActions sx={classes.modalActions}>
                <div style={classes.modalActionsContainer}>
                    <GomakePrimaryButton
                        onClick={handleCloseAddPurchasePricingModal}
                        style={classes.modalCancelButton}
                    >
                        {t("materials.childTable.cancel")}
                    </GomakePrimaryButton>
                    <GomakePrimaryButton
                        onClick={() => handleAddPurchasePricing(null)}
                        style={classes.modalSubmitButton}
                    >
                        {t("materials.childTable.addPurchasePricing")}
                    </GomakePrimaryButton>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export { AddPurchasePricingModal };
