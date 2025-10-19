import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { GomakeTextInput, GoMakeAutoComplate, GoMakeDialog } from "@/components";

import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE, } from "@/pages/customers/enums";
import { currenciesState } from "../../state";
import { useRecoilState } from "recoil";

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
    const convertedPricingUnit = inventoryTableHeadingUnits.pricingUnit;
    const convertedInventoryUnit = inventoryTableHeadingUnits.inventoryUnit;

    return (
        <GoMakeDialog
            open={isAddInventoryModalOpen}
            onClose={handleCloseAddInventoryModal}
            title={t("materials.childTable.addNewInventory")}
            primaryButtonLabel={t("materials.childTable.addInventory")}
            cancelButtonLabel={t("materials.childTable.cancel")}
            onPrimaryAction={handleAddInventory}
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
                        customStyle={{
                            borderBottom: "none",
                            borderRadius: '4px',
                        }}
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
                                borderBottom: "none",
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <div style={classes.modalInputContainerItem}>
                        <div style={classes.modalLabelText2}>
                            {`${t("materials.childTable.quantity")} ${convertedInventoryUnit ? `(${convertedInventoryUnit?.value?.toLowerCase()})` : ''}`}
                            <div style={{ color: "red" }}>*</div>
                        </div>
                        <GomakeTextInput
                            value={inventoryFormData?.quantity?.toString() || ''}
                            onChange={(e) => handleInventoryFormChange('quantity', parseInt(e.target.value))}
                            type="number"
                            placeholder={t("materials.childTable.enterQuantity")}
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
                            {`${t("materials.childTable.purchasePrice")} ${convertedPricingUnit ? `(${convertedPricingUnit?.value?.split('/')[0]?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')})` : ''}`}
                            <div style={{ color: "red" }}>*</div>
                        </div>
                        <GomakeTextInput
                            value={inventoryFormData?.purchasePrice?.toString() || ''}
                            onChange={(e) => handleInventoryFormChange('purchasePrice', parseFloat(e.target.value))}
                            type="number"
                            placeholder={t("materials.childTable.enterPurchasePrice")}
                            style={{
                                borderBottom: "none",
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <div style={classes.modalInputContainerItem}>
                        <div style={classes.modalLabelText2}>{t("materials.childTable.purchaseCurrency")}
                            <div style={{ color: "red" }}>*</div>
                        </div>
                        <GoMakeAutoComplate
                            value={inventoryFormData?.purchaseCurrency?.value || undefined}
                            onChange={(e, value) => handleInventoryFormChange('purchaseCurrency', { value: value?.value, label: value?.label })}
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
                            {`${t("materials.childTable.saleCost")} ${convertedPricingUnit ? `(${convertedPricingUnit?.value?.split('/')[0]?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')})` : ''}`}
                            <div style={{ color: "red" }}>*</div>
                        </div>
                        <GomakeTextInput
                            value={inventoryFormData?.salePrice?.toString() || ''}
                            onChange={(e) => handleInventoryFormChange('salePrice', parseFloat(e.target.value))}
                            type="number"
                            placeholder={t("materials.childTable.enterSalePrice")}
                            style={{
                                borderBottom: "none",
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <div style={classes.modalInputContainerItem}>
                        <div style={classes.modalLabelText2}>{t("materials.childTable.saleCurrency")}
                            <div style={{ color: "red" }}>*</div>
                        </div>
                        <GoMakeAutoComplate
                            value={inventoryFormData?.saleCurrency?.value || undefined}
                            onChange={(e, value) => handleInventoryFormChange('saleCurrency', { value: value?.value, label: value?.label })}
                            options={currencies}
                            placeholder={t("materials.childTable.selectCurrency")}
                            style={{
                                borderBottom: "none",
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
                        customStyle={{
                            borderBottom: "none",
                            borderRadius: '4px',
                        }}
                    />
                </Box>
            </Box>
        </GoMakeDialog>
    );
};

export { AddInventoryModal };
