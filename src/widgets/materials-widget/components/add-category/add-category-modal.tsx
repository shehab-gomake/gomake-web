import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAddMaterialCategory } from "./use-add-material-category";
import { Stack } from "@mui/material";
import { ImageUploadComponent } from "@/components/form-inputs/image-input";
import { useEffect } from "react";

interface IAddCategoryModalProps {
    isAdmin: boolean;
    productList?: any[];
}
const AddCategoryModal = (props: IAddCategoryModalProps) => {
    const {
        openModal,
        editCategoryModalState,
        duplicateCategoryModalState,
        selectedCategoryModal,
        newCategory,
        setOpenModal,
        onAddCategory,
        onSetCategory,
        setEditCategoryModalState,
        setDuplicateCategoryModalState,
        setSelectedCategoryModal,
        uploadPrintHouseMaterialImage,
        t,
        imgUrl,
        setSelectedImgForAdded,
        materialTypeTable,
        updatePrintHouseMaterialCategoryName,
        duplicatePrintHouseMaterialCategoryName
    } = useAddMaterialCategory(props.isAdmin);

    return (
        <GoMakeModal
            insideStyle={{ width: 400, height: "fit-content", padding: 20 }}
            openModal={openModal}
            onClose={() => {
                setEditCategoryModalState(false)
                setDuplicateCategoryModalState(false)
                setSelectedCategoryModal({})
                setOpenModal(false)
            }}
            modalTitle={duplicateCategoryModalState
                ? t("navigationButtons.duplicate")
                : editCategoryModalState
                    ? t("materials.buttons.edit")
                    : t("materials.buttons.addNew")}
        >
            <Stack gap={5} justifyContent={'flex-start'} height={'100%'} width={'90%'} margin={'auto'} marginTop={"20px"}>
                <GomakeTextInput
                    value={newCategory}
                    onChange={onSetCategory}
                    placeholder={t("materials.inputs.addCategory")}
                    style={{ width: '100%', height: "40px" }}
                />
                {/* <GoMakeAutoComplate
                    options={props?.productList}
                    getOptionLabel={(option: any) => `${option.name} - ${option.code}`}
                    style={{
                        width: "100%",
                        borderRadius: 4,
                        height: 40
                    }}
                    placeholder={t("home.admin.selectProduct")}
                    onChange={(e, value) => {
                    }}
                /> */}

                {(editCategoryModalState ? selectedCategoryModal?.isCanUploadImage : materialTypeTable?.isCanUploadImage) && (
                    <ImageUploadComponent
                        onChange={(value) => editCategoryModalState ? uploadPrintHouseMaterialImage(value) : setSelectedImgForAdded(value)}
                        value={imgUrl}
                    />
                )}
                {
                    <SecondaryButton
                        onClick={duplicateCategoryModalState ? duplicatePrintHouseMaterialCategoryName : editCategoryModalState ? updatePrintHouseMaterialCategoryName : onAddCategory}
                        variant={'contained'}
                        sx={{ width: '100%' }}
                    >
                        {
                            duplicateCategoryModalState
                                ? t("navigationButtons.duplicate")
                                : editCategoryModalState
                                    ? t("materials.buttons.edit")
                                    : t("materials.buttons.addNew")
                        }
                    </SecondaryButton>
                }
            </Stack>
        </GoMakeModal>
    )
}

export { AddCategoryModal }