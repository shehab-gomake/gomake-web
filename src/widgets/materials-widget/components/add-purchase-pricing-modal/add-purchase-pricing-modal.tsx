import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";

import { GomakeTextInput, GoMakeAutoComplate, GoMakeDialog } from "@/components";

import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE, } from "@/pages/customers/enums";
import { useRecoilState } from "recoil";
import { currenciesState } from "../../state";
import { Add as AddIcon } from "@mui/icons-material";






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
    const convertedPurchasePricingUnit = purchasePricingTableHeadingUnits.pricingUnit;
    const convertedPurchasePricingInventoryUnit = purchasePricingTableHeadingUnits.inventoryUnit;

    return (
        <GoMakeDialog
            open={isAddPurchasePricingModalOpen}
            onClose={handleCloseAddPurchasePricingModal}
            title={t("materials.childTable.addNewSupplierForMaterial")}
            primaryButtonLabel={t("materials.sheetPaper.addNewSupplier")}
            cancelButtonLabel={t("materials.childTable.cancel")}
            onPrimaryAction={() => handleAddPurchasePricing(null)}
            maxWidth="sm"
            fullWidth
        >
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
                            {`${t("materials.childTable.purchasePrice")} ${convertedPurchasePricingUnit ? `(${convertedPurchasePricingUnit?.value?.split('/')[0]?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')})` : ''}`}
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
                            {`${t("materials.childTable.quantityInPackage")} ${convertedPurchasePricingInventoryUnit ? `(${convertedPurchasePricingInventoryUnit.value?.toLowerCase()})` : ''}`}
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
        </GoMakeDialog>
    );
};

export { AddPurchasePricingModal };
