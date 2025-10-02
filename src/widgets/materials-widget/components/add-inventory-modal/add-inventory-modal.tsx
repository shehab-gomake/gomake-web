import React from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, IconButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { GomakeTextInput, GomakePrimaryButton, GoMakeAutoComplate, } from "@/components";

import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE, } from "@/pages/customers/enums";
import { currenciesState } from "../../state";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "@/store/user";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits } from "@/utils/helpers";

const AddInventoryModal = ({
    isAddInventoryModalOpen,
    handleCloseAddInventoryModal,
    t,
    classes,
    selectedSupplier,
    handleSupplierSelect,
    renderOptionsSupplier,
    checkWhatRenderArraySupplier,
    isFetchingSupplier,
    inventoryFormData,
    handleAddInventory,
    inventoryTableHeadingUnits,
    setOpenSupplierModal,
    handleInventoryFormChange,
    selectedClients,
    handleClientSelect,
    renderOptionsCustomer,
    checkWhatRenderArrayCustomer,
    isFetchingCustomer,
}) => {
    const [currencies, setCurrencies] = useRecoilState<{ label: string; value: string }[]>(currenciesState);
    const user = useRecoilValue<any>(userState);
    const unitType = user?.printHouseProfile?.unitType || 0;
    const convertedPricingUnit =
        unitType === UNIT_TYPE.IMPERIAL
            ? convertTitleUnits(inventoryTableHeadingUnits.pricingUnit)
            : inventoryTableHeadingUnits.pricingUnit;
    const convertedInventoryUnit =
        unitType === UNIT_TYPE.IMPERIAL
            ? convertTitleUnits(inventoryTableHeadingUnits.inventoryUnit)
            : inventoryTableHeadingUnits.inventoryUnit;

    return (
        <Dialog
            open={isAddInventoryModalOpen}
            onClose={handleCloseAddInventoryModal}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={classes.dialogTitle}>{t("materials.childTable.addNewInventory")}</DialogTitle>
            <DialogContent sx={classes.modalContent1}>
                <Box sx={classes.modalContent}>
                    <Box>
                        <div style={classes.modalLabelText}>{t("materials.childTable.supplier")}
                            <Tooltip title={t("materials.sheetPaper.addNewSupplier")}>
                                <IconButton onClick={() => setOpenSupplierModal(true)}>
                                    <AddIcon sx={{ color: "#f50057" }} />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <ClientAutocomplete
                            key={selectedSupplier?.id}
                            clientType={CLIENT_TYPE.SUPPLIER}
                            onChange={handleSupplierSelect}
                            options={renderOptionsSupplier || []}
                            placeholder={t("materials.childTable.selectSupplier")}
                            style={{ width: '100%' }}
                            value={selectedSupplier}
                            onChangeTextField={checkWhatRenderArraySupplier}
                            loading={isFetchingSupplier}
                            getOptionLabel={(option: any) => `${option.name}`}
                        />
                    </Box>
                    <div style={classes.modalInputContainer}>
                        <div style={classes.modalInputContainerItem}>
                            <GomakeTextInput
                                labelText={t("materials.childTable.code")}
                                value={inventoryFormData.code}
                                onChange={(e) => handleInventoryFormChange('code', e.target.value)}
                                placeholder={t("materials.childTable.enterCode")}
                                style={{
                                    borderBottom: !inventoryFormData.code ? '2px solid #EC038D' : '2px solid rgb(67,195,232)',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={classes.modalInputContainerItem}>
                            <GomakeTextInput
                                labelText={`${t("materials.childTable.quantity")} ${convertedInventoryUnit ? `(${t(`measurementUnits.${convertedInventoryUnit}`)})` : ''}`}
                                value={inventoryFormData.quantity.toString()}
                                onChange={(e) => handleInventoryFormChange('quantity', parseInt(e.target.value) || 0)}
                                type="number"
                                placeholder={t("materials.childTable.enterQuantity")}
                                style={{
                                    borderBottom: !inventoryFormData.quantity ? '2px solid #EC038D' : '2px solid rgb(67,195,232)',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>

                    <div style={classes.modalInputContainer}>
                        <div style={classes.modalInputContainerItem}>
                            <GomakeTextInput
                                labelText={`${t("materials.childTable.purchasePrice")} ${convertedPricingUnit ? `(${t(`measurementUnits.${convertedPricingUnit}`).split(' / ')[0]})` : ''}`}
                                value={inventoryFormData.purchasePrice.toString()}
                                onChange={(e) => handleInventoryFormChange('purchasePrice', parseFloat(e.target.value) || 0)}
                                type="number"
                                placeholder={t("materials.childTable.enterPurchasePrice")}
                                style={{
                                    borderBottom: !inventoryFormData.purchasePrice ? '2px solid #EC038D' : '2px solid rgb(67,195,232)',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={classes.modalInputContainerItem}>
                            <GoMakeAutoComplate
                                value={inventoryFormData.purchaseCurrency.value || undefined}
                                onChange={(e, value) => handleInventoryFormChange('purchaseCurrency', { value: value?.value, label: value?.label })}
                                options={currencies}
                                placeholder={t("materials.childTable.selectCurrency")}
                                labelText={t("materials.childTable.purchaseCurrency")}
                                style={{
                                    borderBottom: !inventoryFormData.purchaseCurrency.value ? '2px solid #EC038D' : '2px solid rgb(67,195,232)',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>

                    <div style={classes.modalInputContainer}>
                        <div style={classes.modalInputContainerItem}>
                            <GomakeTextInput
                                labelText={`${t("materials.childTable.saleCost")} ${convertedPricingUnit ? `(${t(`measurementUnits.${convertedPricingUnit}`).split(' / ')[0]})` : ''}`}
                                value={inventoryFormData.salePrice.toString()}
                                onChange={(e) => handleInventoryFormChange('salePrice', parseFloat(e.target.value) || 0)}
                                type="number"
                                placeholder={t("materials.childTable.enterSalePrice")}
                                style={{
                                    borderBottom: !inventoryFormData.salePrice ? '2px solid #EC038D' : '2px solid rgb(67,195,232)',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div style={classes.modalInputContainerItem}>
                            <GoMakeAutoComplate
                                value={inventoryFormData.saleCurrency.value || undefined}
                                onChange={(e, value) => handleInventoryFormChange('saleCurrency', { value: value?.value, label: value?.label })}
                                options={currencies}
                                placeholder={t("materials.childTable.selectCurrency")}
                                labelText={t("materials.childTable.saleCurrency")}
                                style={{
                                    borderBottom: !inventoryFormData.saleCurrency.value ? '2px solid #EC038D' : '2px solid rgb(67,195,232)',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>



                    <Box>
                        <div style={classes.modalLabelText}>{t("materials.childTable.clients")}</div>
                        <ClientAutocomplete
                            key={selectedClients[0]?.id}
                            clientType={CLIENT_TYPE.CUSTOMER}
                            onChange={handleClientSelect}
                            options={renderOptionsCustomer || []}
                            placeholder={t("materials.childTable.selectClient")}
                            style={{ width: '100%' }}
                            value={selectedClients[0] || null}
                            onChangeTextField={checkWhatRenderArrayCustomer}
                            getOptionLabel={(option: any) => `${option.name} - ${option.code || ''}`}
                            loading={isFetchingCustomer}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={classes.modalActions}>
                <GomakePrimaryButton
                    onClick={handleCloseAddInventoryModal}
                    style={classes.modalCancelButton}
                >
                    {t("materials.childTable.cancel")}
                </GomakePrimaryButton>
                <GomakePrimaryButton
                    onClick={handleAddInventory}
                    style={classes.modalSubmitButton}
                >
                    {t("materials.childTable.addInventory")}
                </GomakePrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export { AddInventoryModal };
