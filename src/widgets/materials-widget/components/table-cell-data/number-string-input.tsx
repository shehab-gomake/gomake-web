import { IRowData } from "@/widgets/materials-widget/interface";
import { useCallback, useState } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/materials-widget/style";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { useRecoilValue } from "recoil";
import { materialCategorySuppliersState } from "../../state";
import { GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";
import { ModalType, UNIT_TYPE } from "@/enums";
import { convertValueToImperial } from "@/utils/helpers";
import { convertValueToOriginalUnit } from "@/utils/helpers";

import { userState } from "@/store/user";

const NumberStringInput = ({ value, isEditable, parameterKey, id, isAdmin, unit, isInventoryTable, isPurchasePricingTable }: IRowData) => {

    const { classes } = useStyle();
    const { t } = useTranslation();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [updateValue, setUpdateValue] = useState('');
    const user = useRecoilValue<any>(userState);
    const unitType = user?.printHouseProfile?.unitType || 0

    const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
    const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1

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
            const data = unitType === UNIT_TYPE.IMPERIAL ? convertValueToImperial(unit, value) : value
            setIsUpdate(true);
            setUpdateValue(data);
        }
    }
    const onInputChange = (v: string) => {
        setUpdateValue(v)
    }

    const onBlur = () => {
        if (updateValue !== value) {
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
                setIsLoading(true)
                updateCellData(id, parameterKey.includes("Currency") ? "currency" : parameterKey, originalValue, priceIndex, pricingType).then(
                    () => {
                        setIsLoading(false);
                        setIsUpdate(false);
                    }
                );
            } else if (isHaveMorethanMaterialSuppliers && !parameterKey.includes("price")) {
                onClickOpenDeleteTableRowModal()
            } else {
                const originalValue = unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(unit, updateValue) : updateValue;
                setIsLoading(true)
                updateCellData(id, parameterKey, originalValue).then(
                    () => {
                        setIsLoading(false);
                        setIsUpdate(false);
                    }
                );
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
                isEditable ?
                    <PrimaryButton
                        style={{ minWidth: "max-content" }}
                        sx={classes.clickableData}
                        onClick={onClick}
                        variant={'text'}
                    >
                        {unitType === UNIT_TYPE.IMPERIAL ? convertValueToImperial(unit, value) : value}
                    </PrimaryButton>
                    : <span>{unitType === UNIT_TYPE.IMPERIAL ? convertValueToImperial(unit, value) : value}</span>

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