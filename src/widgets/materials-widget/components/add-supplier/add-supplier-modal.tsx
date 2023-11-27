import {GoMakeAutoComplate, GoMakeModal} from "@/components";
import Stack from "@mui/material/Stack";
import {SecondaryButton} from "@/components/button/secondary-button";
import {useEffect} from "react";
import {useAddMaterialSupplier} from "@/widgets/materials-widget/components/add-supplier/use-add-material-supplier";
import { useMaterials } from "../../use-materials";

const AddSupplierModal = () => {
    const {getPrintHouseSuppliersList, suppliers, onSelectSupplier, onAddSupplier, setOpenModal, openModal} = useAddMaterialSupplier();
    const {materialCategories} = useMaterials();

    useEffect(() => {
        getPrintHouseSuppliersList().then();
    }, [])
    
    return (
        <GoMakeModal modalTitle={'Add supplier'} insideStyle={{width: 400, height: 300}} openModal={openModal}
                     onClose={() => setOpenModal(false)}>
            <Stack gap={2}  justifyContent={'center'} height={'100%'} width={'90%'} margin={'auto'}>
                <GoMakeAutoComplate  onChange={onSelectSupplier} options={suppliers} placeholder={'Add supplier'}/>
                <SecondaryButton onClick={()=>onAddSupplier(materialCategories)} variant={'contained'} sx={{width: '100%'}}>update</SecondaryButton>
            </Stack>
        </GoMakeModal>
    )
}

export {AddSupplierModal}