import { GoMakeAutoComplate, GoMakeModal, GomakeTextInput } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAddMaterialCategory } from "./use-add-material-category";
import { Stack } from "@mui/material";
import { ImageUploadComponent } from "@/components/form-inputs/image-input";

interface IAddCategoryModalProps {
    isAdmin: boolean;
    productList?: any[];
}
const AddCategoryModal = (props: IAddCategoryModalProps) => {
    const {
        openModal,
        editCategoryModalState,
        selectedCategoryModal,
        newCategory,
        setOpenModal,
        onAddCategory,
        onSetCategory,
        setEditCategoryModalState,
        setSelectedCategoryModal,
        uploadPrintHouseMaterialImage,
        imgUrl,
        setSelectedImgForAdded,
        t } = useAddMaterialCategory(props.isAdmin);
    return (
        <GoMakeModal
            insideStyle={{ width: 400, height: "fit-content", padding: 20 }}
            openModal={openModal}
            onClose={() => {
                setEditCategoryModalState(false)
                setSelectedCategoryModal({})
                setOpenModal(false)
            }}
            modalTitle={editCategoryModalState ? t("materials.buttons.edit") : t("materials.buttons.addNew")}
        >
            <Stack gap={5} justifyContent={'flex-start'} height={'100%'} width={'90%'} margin={'auto'} marginTop={"20px"}>
                <GomakeTextInput
                    value={newCategory}
                    onChange={onSetCategory}
                    placeholder={t("materials.inputs.addCategory")}
                    style={{ width: '100%', height: "40px" }}
                    disabled={editCategoryModalState}
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
                        console.log("value", value)
                    }}
                /> */}
                <ImageUploadComponent
                    onChange={(value) => editCategoryModalState ? uploadPrintHouseMaterialImage(value) : setSelectedImgForAdded(value)}
                    value={imgUrl}
                />
                {
                    !editCategoryModalState && <SecondaryButton
                        onClick={onAddCategory}
                        variant={'contained'}
                        sx={{ width: '100%' }}
                    >
                        {editCategoryModalState ? t("materials.buttons.edit") : t("materials.buttons.add")}
                    </SecondaryButton>
                }

            </Stack>
        </GoMakeModal>
    )
}

export { AddCategoryModal }