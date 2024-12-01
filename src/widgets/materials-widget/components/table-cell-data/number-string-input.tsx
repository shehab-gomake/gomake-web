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
import { ModalType } from "@/enums";


const NumberStringInput = ({ value, isEditable, parameterKey, id, isAdmin }: IRowData) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [updateValue, setUpdateValue] = useState('');
    const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
    const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1

    const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
    const onClickCloseDeleteTableRowModal = () => {
        setOpenDeleteTableRowModal(false);
    };

    const onClickOpenDeleteTableRowModal = () => {
        setOpenDeleteTableRowModal(true);
    };
    const { updateCellData } = useTableCellData(isAdmin);
    const onClick = () => {
        if (isEditable) {
            setIsUpdate(true);
            setUpdateValue(value as string);
        }
    }
    const onInputChange = (v: string) => {
        setUpdateValue(v)
    }

    const onBlur = () => {
        if (updateValue !== value) {
            if (isHaveMorethanMaterialSuppliers && !parameterKey.includes("price")) {
                onClickOpenDeleteTableRowModal()
            }
            else {
                setIsLoading(true)
                updateCellData(id, parameterKey, updateValue).then(
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
            {isUpdate ? isLoading ? <DotsLoader /> : <UpdateValueInput clickedOut={onClickOut()} onInputChange={onInputChange} value={updateValue as string} onUpdate={onBlur}
                onCancel={() => setIsUpdate(false)} /> :
                isEditable ? <PrimaryButton style={{ minWidth: "max-content" }} sx={classes.clickableData} onClick={onClick} variant={'text'}>{value}</PrimaryButton> : <span>{value}</span>
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
                    updateCellData(id, parameterKey, updateValue).then(
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