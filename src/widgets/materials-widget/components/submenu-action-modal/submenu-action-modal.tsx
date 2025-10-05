import React, { useState, useEffect } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, IconButton } from "@mui/material";
import { GomakeTextInput, GomakePrimaryButton, GoMakeAutoComplate } from "@/components";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useRecoilValue } from "recoil";
import { currenciesState } from "../../state";
import { Add as AddIcon } from "@mui/icons-material";
import { EMaterialsActions } from "../../enums";

interface ISubmenuActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        submenuOption: number;
        priceValue?: string;
        supplier?: any;
        currency?: any;
    }) => void;
    t: any;
    actionText: string;
    actionType: EMaterialsActions;
    submenuOption: number;
    selectedSupplier: any;
    setSelectedSupplier: (supplier: any) => void;
    renderOptionsSupplier: any[];
    checkWhatRenderArraySupplier: (e: any) => void;
    isFetchingSupplier: boolean;
    setOpenSupplierModal: (open: boolean) => void;
}

const SubmenuActionModal: React.FC<ISubmenuActionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    t,
    actionText,
    actionType,
    submenuOption,
    selectedSupplier,
    setSelectedSupplier,
    renderOptionsSupplier,
    checkWhatRenderArraySupplier,
    isFetchingSupplier,
    setOpenSupplierModal,
}) => {
    const [priceValue, setPriceValue] = useState<string>("");
    const [currency, setCurrency] = useState<any>(null);
    const currencies = useRecoilValue(currenciesState);

    // Determine if this is a currency update action or price update action
    const isCurrencyAction = actionType === EMaterialsActions.UpdateCurrency;
    const isPriceAction = !isCurrencyAction;

    const handleSubmit = () => {
        // For currency actions, require currency selection
        if (isCurrencyAction && !currency) {
            return;
        }

        // For price actions, require price value
        if (isPriceAction && (!priceValue || priceValue === "")) {
            return;
        }

        // For options 1 and 2, require supplier selection
        if ((submenuOption === 1 || submenuOption === 2) && !selectedSupplier) {
            return;
        }

        onSubmit({
            submenuOption,
            priceValue: isPriceAction ? priceValue : undefined,
            supplier: selectedSupplier,
            currency: isCurrencyAction ? currency : undefined,
        });

        // Reset form
        setPriceValue("");
        setSelectedSupplier(null);
        setCurrency(null);
    };

    const handleClose = () => {
        // Reset form
        setPriceValue("");
        setSelectedSupplier(null);
        setCurrency(null);
        onClose();
    };

    const handleSupplierSelect = (e: any, supplier: any) => {
        setSelectedSupplier(supplier);
    };

    // Get the submenu option label for display
    const getSubmenuOptionLabel = () => {
        switch (submenuOption) {
            case 0:
                return t("materialsActions.updateDefaultSaleCost");
            case 1:
                return t("materialsActions.updateInventorySaleCost");
            case 2:
                return t("materialsActions.updateSupplierPurchasePrice");
            default:
                return "";
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{getSubmenuOptionLabel() || t("materialsActions." + actionText)}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    {/* Supplier Selection - Only show for options 1 and 2 */}
                    {(submenuOption === 1 || submenuOption === 2) && (
                        <Box>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>
                                {t("materials.childTable.supplier")}
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
                                style={{ width: "100%" }}
                                value={selectedSupplier}
                                onChangeTextField={checkWhatRenderArraySupplier}
                                loading={isFetchingSupplier}
                                getOptionLabel={(option: any) => `${option.name}`}
                            />
                        </Box>
                    )}

                    {/* Price Input - Only show for price actions */}
                    {isPriceAction && (
                        <Box>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>
                                {t("materials.childTable.price")}
                            </div>
                            <GomakeTextInput
                                onChange={(e) => setPriceValue(e.target.value)}
                                value={priceValue}
                                type="number"
                                placeholder={t("reports.enterPrice")}
                                style={{
                                    width: "100%",
                                    height: 40,
                                    borderBottom: !priceValue ? "1px solid red" : "1px solid #ccc",
                                }}
                            />
                        </Box>
                    )}

                    {/* Currency Selection - Only show for currency actions */}
                    {isCurrencyAction && (
                        <Box>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>
                                {t("materials.childTable.currency")}
                            </div>
                            <GoMakeAutoComplate
                                style={{ width: "100%" }}
                                value={currency}
                                options={currencies}
                                onChange={(e, value) => setCurrency(value)}
                                placeholder={t("materials.inputs.chooseCurrency")}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 2, gap: 1 }}>
                <GomakePrimaryButton onClick={handleClose} variant="outlined">
                    {t("modal.cancel")}
                </GomakePrimaryButton>
                <GomakePrimaryButton
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={
                        (isPriceAction && !priceValue) ||
                        (isCurrencyAction && !currency) ||
                        ((submenuOption === 1 || submenuOption === 2) && !selectedSupplier)
                    }
                >
                    {t("profileSettings.update")}
                </GomakePrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export { SubmenuActionModal };

