import { IRowData } from "@/widgets/materials-widget/interface";
import { useCallback, useState, useEffect } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/materials-widget/style";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { useRecoilValue, useRecoilState } from "recoil";
import { materialCategorySuppliersState, materialCategoryDataState } from "../../state";
import { GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { ModalType, UNIT_TYPE } from "@/enums";
import { convertValueToImperial } from "@/utils/helpers";
import { convertValueToOriginalUnit } from "@/utils/helpers";
import { useSnackBar } from "@/hooks";

import { userState } from "@/store/user";

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

    const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
    const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

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

    const onBlur = () => {
        if (updateValue !== value) {
            // Optimistic update - show new value immediately
            setOptimisticValue(updateValue);
            setIsUpdate(false);

            const originalPreviousValue = optimisticValue; // Store previous value for rollback

            if (isInventoryTable) {
                // Determine priceIndex and pricingType for inventory fields
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
                } else if (parameterKey === "purchaseCurrency") {
                    priceIndex = 0;
                    pricingType = 1;
                } else if (parameterKey === "saleCurrency") {
                    priceIndex = 0;
                    pricingType = 2;
                }

                const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                setIsLoading(true);

                updateCellData(id, parameterKey.includes("Currency") ? "currency" : parameterKey, originalValue, priceIndex, pricingType)
                    .then((response: any) => {
                        setIsLoading(false);
                        // Check if the response indicates success or failure
                        if (response && response.success !== false) {
                            alertSuccessUpdate();
                        } else {
                            // Revert to previous value if API response indicates failure
                            setOptimisticValue(originalPreviousValue);
                            alertFaultUpdate();
                        }
                    })
                    .catch(() => {
                        setIsLoading(false);
                        // Revert to previous value if API fails
                        setOptimisticValue(originalPreviousValue);
                        alertFaultUpdate();
                    });
            } else if (isHaveMorethanMaterialSuppliers && !parameterKey.includes("price")) {
                onClickOpenDeleteTableRowModal()
            } else {
                const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                setIsLoading(true);

                updateCellData(id, parameterKey, originalValue)
                    .then((response: any) => {
                        setIsLoading(false);
                        // Check if the response indicates success or failure
                        if (response && response.success !== false) {
                            alertSuccessUpdate();
                        } else {
                            // Revert to previous value if API response indicates failure
                            setOptimisticValue(originalPreviousValue);
                            alertFaultUpdate();
                        }
                    })
                    .catch(() => {
                        setIsLoading(false);
                        // Revert to previous value if API fails
                        setOptimisticValue(originalPreviousValue);
                        alertFaultUpdate();
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
                    setIsLoading(true)
                    const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                    updateCellData(id, parameterKey, originalValue).then(
                        () => {
                            setIsLoading(false);

                            setIsUpdate(false);

                        }
                    );
                }}
            />
        </>
    )
}

export { NumberStringInput }