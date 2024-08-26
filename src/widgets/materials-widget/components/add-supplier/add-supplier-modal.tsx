import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect } from "react";
import { useAddMaterialSupplier } from "@/widgets/materials-widget/components/add-supplier/use-add-material-supplier";
import { useMaterials } from "../../use-materials";
import { useTranslation } from "react-i18next";
import { useSupplier } from "@/hooks/use-supplier";

const AddSupplierModal = () => {
    const { onSelectSupplier, onAddSupplier, setOpenModal, openModal } = useAddMaterialSupplier();
    const { materialCategories } = useMaterials(false);
    const { t } = useTranslation();
    const {getAllSupplierList, renderSuppliersOptions,checkWhatRenderArray } = useSupplier();
    
    useEffect(() => {
        getAllSupplierList().then();
    }, [])

    return (
        <GoMakeModal modalTitle={t("materials.modals.addSupplier")} insideStyle={{ width: 400, height: 300 }} openModal={openModal}
            onClose={() => setOpenModal(false)}>
            <Stack gap={2} justifyContent={'center'} height={'100%'} width={'90%'} margin={'auto'}>
                <GoMakeAutoComplate onChange={onSelectSupplier} onChangeTextField={checkWhatRenderArray} options={renderSuppliersOptions()} placeholder={t("materials.modals.addSupplier")} />
                <SecondaryButton onClick={() => onAddSupplier(materialCategories)} variant={'contained'} sx={{ width: '100%' }}>{t("materials.modals.update")}</SecondaryButton>
            </Stack>
        </GoMakeModal>
    )
}

export { AddSupplierModal }