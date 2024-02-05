import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect } from "react";
import { useAddMaterialSupplier } from "@/widgets/materials-widget/components/add-supplier/use-add-material-supplier";
import { useMaterials } from "../../use-materials";
import { useTranslation } from "react-i18next";

const AddSupplierModal = () => {
    const { getPrintHouseSuppliersList, suppliers, onSelectSupplier, onAddSupplier, setOpenModal, openModal } = useAddMaterialSupplier();
    const { materialCategories } = useMaterials(false);
    const { t } = useTranslation();
    useEffect(() => {
        getPrintHouseSuppliersList().then();
    }, [])

    return (
        <GoMakeModal modalTitle={t("materials.modals.addSupplier")} insideStyle={{ width: 400, height: 300 }} openModal={openModal}
            onClose={() => setOpenModal(false)}>
            <Stack gap={2} justifyContent={'center'} height={'100%'} width={'90%'} margin={'auto'}>
                <GoMakeAutoComplate onChange={onSelectSupplier} options={suppliers} placeholder={t("materials.modals.addSupplier")} />
                <SecondaryButton onClick={() => onAddSupplier(materialCategories)} variant={'contained'} sx={{ width: '100%' }}>{t("materials.modals.update")}</SecondaryButton>
            </Stack>
        </GoMakeModal>
    )
}

export { AddSupplierModal }