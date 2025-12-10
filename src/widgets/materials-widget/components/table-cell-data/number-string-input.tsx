import { IRowData } from "@/widgets/materials-widget/interface";
import { useCallback, useState, useEffect } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/materials-widget/style";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { useRecoilValue, useRecoilState } from "recoil";
import { materialCategorySuppliersState, materialCategoryDataState } from "../../state";
import { GoMakeDeleteModal, GoMakeDialog } from "@/components";
import { useTranslation } from "react-i18next";
import { ModalType, UNIT_TYPE } from "@/enums";
import { convertValueToImperial } from "@/utils/helpers";
import { convertValueToOriginalUnit } from "@/utils/helpers";
import { userState } from "@/store/user";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

const NumberStringInput = ({ value, isEditable, parameterKey, id, isAdmin, unit, isInventoryTable, isPurchasePricingTable }: IRowData) => {

    const { classes } = useStyle();
    const { t } = useTranslation();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [updateValue, setUpdateValue] = useState('');
    const [optimisticValue, setOptimisticValue] = useState(value);
    const [data, setData] = useRecoilState(materialCategoryDataState);
    const user = useRecoilValue<any>(userState);
    const unitType = user?.printHouseProfile?.unitType || 0
    const router = useRouter();
    const { materialType, materialCategory } = router.query;

    console.log("materialType", materialType);
    console.log("materialCategory", materialCategory);

    const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
    const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1

    // Update optimistic value when props change
    useEffect(() => {
        setOptimisticValue(value);
    }, [value]);

    const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
    const onClickCloseDeleteTableRowModal = () => {
        setOpenDeleteTableRowModal(false);
    };

    const onClickOpenDeleteTableRowModal = () => {
        setOpenDeleteTableRowModal(true);
    };
    const { updateCellData } = useTableCellData(isAdmin, isInventoryTable, isPurchasePricingTable);
    const onClick = () => {
        if (isEditable) {
            const data = unitType === UNIT_TYPE.IMPERIAL ? convertValueToImperial(unit, optimisticValue) : optimisticValue
            setIsUpdate(true);
            setUpdateValue(data);
        }
    }
    const onInputChange = (v: string) => {
        setUpdateValue(v)
    }
    const [openWeightDialog, setOpenWeightDialog] = useState<boolean>(false);

    const onClickOpenWeightDialog = () => {
        setOpenWeightDialog(true);
    };

    const onBlur = () => {
        if (updateValue !== value) {
            // Optimistic update - show new value immediately
            setOptimisticValue(updateValue);
            setIsUpdate(false);

            const originalPreviousValue = optimisticValue; // Store previous value for rollback

            if (isInventoryTable || isPurchasePricingTable) {
                // Determine priceIndex and pricingType for inventory and purchase pricing fields
                let priceIndex = 0;
                let pricingType = 1; // Default to PurchasePrice

                if (parameterKey === "purchaseM2Price") {
                    priceIndex = 0;
                    pricingType = 1;
                } else if (parameterKey === "purchaseRollPrice") {
                    priceIndex = 1;
                    pricingType = 1;
                } else if (parameterKey === "saleM2Price") {
                    priceIndex = 0;
                    pricingType = 2;
                } else if (parameterKey === "saleRollPrice") {
                    priceIndex = 1;
                    pricingType = 2;
                } else if (parameterKey === "purchaseCurrency" || parameterKey === "currency") {
                    priceIndex = 0;
                    pricingType = 1;
                } else if (parameterKey === "saleCurrency") {
                    priceIndex = 0;
                    pricingType = 2;
                }

                const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                setIsLoading(true);

                // Map parameterKey to correct API key for new data structure
                let apiKey = parameterKey;
                if (parameterKey === "purchaseM2Price") {
                    apiKey = "perUnit";
                } else if (parameterKey === "purchaseRollPrice") {
                    apiKey = "perTon";
                } else if (parameterKey === "saleM2Price") {
                    apiKey = "perUnit";
                } else if (parameterKey === "saleRollPrice") {
                    apiKey = "perTon";
                } else if (parameterKey.includes("Currency")) {
                    apiKey = "currency";
                }

                updateCellData(id, apiKey, originalValue, priceIndex, pricingType)
                    .then((response: any) => {
                        setIsLoading(false);
                        // Check if the response indicates success or failure
                        if (response && response.success === false) {
                            // Revert to previous value if API response indicates failure
                            setOptimisticValue(originalPreviousValue);
                        }
                    })
                    .catch(() => {
                        setIsLoading(false);
                        // Revert to previous value if API fails
                        setOptimisticValue(originalPreviousValue);
                    });
            } else if (isHaveMorethanMaterialSuppliers && !parameterKey.includes("price")) {
                onClickOpenDeleteTableRowModal()
            }
            else if (unitType === UNIT_TYPE.IMPERIAL && (parameterKey === "weight" || parameterKey === "weightGSM") && materialType === "sheets") {
                onClickOpenWeightDialog();
            }
            else {
                const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                setIsLoading(true);

                updateCellData(id, parameterKey, originalValue)
                    .then((response: any) => {
                        setIsLoading(false);
                        // Check if the response indicates success or failure
                        if (response && response.success === false) {
                            // Revert to previous value if API response indicates failure
                            setOptimisticValue(originalPreviousValue);
                        }
                    })
                    .catch(() => {
                        setIsLoading(false);
                        // Revert to previous value if API fails
                        setOptimisticValue(originalPreviousValue);
                    });
            }
        } else {
            setIsUpdate(false);
        }
    }

    const onClickOut = useCallback(() => {
        return onBlur
    }, [updateValue])




    return (
        <>
            {isUpdate ? isLoading ?
                <DotsLoader /> :
                <UpdateValueInput
                    clickedOut={onClickOut()}
                    onInputChange={onInputChange}
                    value={updateValue as string}
                    onUpdate={onBlur}
                    onCancel={() => setIsUpdate(false)}
                />
                :
                isLoading ? <DotsLoader />
                    :
                    isEditable ?
                        <PrimaryButton
                            style={{ minWidth: "max-content" }}
                            sx={classes.clickableData}
                            onClick={onClick}
                            variant={'text'}
                        >
                            {unitType === UNIT_TYPE.IMPERIAL ? convertValueToImperial(unit, optimisticValue) : optimisticValue}
                        </PrimaryButton>
                        : <span>{unitType === UNIT_TYPE.IMPERIAL ? convertValueToImperial(unit, optimisticValue) : optimisticValue}</span>

            }
            <GoMakeDeleteModal
                modalType={ModalType.EDIT}
                openModal={openDeleteTableRowModal}
                onClose={onClickCloseDeleteTableRowModal}
                hideIcon
                title={t("materials.modals.updateModalTitle")}
                yesBtn={t("documentingSettings.update")}
                onClickDelete={() => {
                    if (unitType === UNIT_TYPE.IMPERIAL && (parameterKey === "weight" || parameterKey === "weightGSM") && materialType === "sheets") {
                        onClickOpenWeightDialog();
                    }
                    else {
                        setIsLoading(true)
                        const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                        updateCellData(id, parameterKey, originalValue).then(
                            () => {
                                setIsLoading(false);
                                setIsUpdate(false);
                            }
                        );
                    }
                }
                }
            />
            <GoMakeDialog
                open={openWeightDialog}
                onClose={() => setOpenWeightDialog(false)}
                title={t("materials.modals.weightDialogTitle")}
                primaryButtonLabel={t("modal.yes")}
                cancelButtonLabel={t("modal.no")}
                onPrimaryAction={() => {
                    setIsLoading(true)
                    const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                    updateCellData(id, parameterKey, originalValue, undefined, undefined, true).then(
                        () => {
                            setIsLoading(false);
                            setIsUpdate(false);
                            setOpenWeightDialog(false)
                        }
                    );
                }}
                onCancel={() => {
                    setIsLoading(true)
                    const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                    updateCellData(id, parameterKey, originalValue, undefined, undefined, false).then( // false to not update related fields
                        () => {
                            setIsLoading(false);
                            setIsUpdate(false);
                            setOpenWeightDialog(false)
                        }
                    );
                }}
            >
                <div>
                    <Typography variant="body1">{t("materials.modals.weightDialogDescription", {
                        weight: parameterKey !== "weight" ? t("materials.modals.weight") : t("materials.modals.weightGSM")
                    })}</Typography>
                </div>
            </GoMakeDialog>
        </>
    )
}

export { NumberStringInput }