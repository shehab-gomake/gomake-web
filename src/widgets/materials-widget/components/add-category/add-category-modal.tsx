import { GoMakeModal, GomakeTextInput } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAddMaterialCategory } from "./use-add-material-category";
import { Stack } from "@mui/material";

interface IAddCategoryModalProps {
    isAdmin: boolean;
}
const AddCategoryModal = (props: IAddCategoryModalProps) => {
    const { setOpenModal, openModal, onSetCategory, onAddCategory, t } = useAddMaterialCategory(props.isAdmin);

    return (
        <GoMakeModal
            insideStyle={{ width: 400, height: 300, padding: 20 }}
            openModal={openModal}
            onClose={() => setOpenModal(false)}
            modalTitle={t("materials.buttons.addNew")}
        >
            <Stack gap={2} justifyContent={'center'} height={'100%'} width={'90%'} margin={'auto'}>
                <GomakeTextInput onChange={onSetCategory} placeholder={t("materials.inputs.addCategory")} style={{ width: '100%', height: "40px" }}></GomakeTextInput>
                <SecondaryButton onClick={onAddCategory} variant={'contained'} sx={{ width: '100%' }}>{t("materials.buttons.add")}</SecondaryButton>
            </Stack>
        </GoMakeModal>
    )
}

export { AddCategoryModal }