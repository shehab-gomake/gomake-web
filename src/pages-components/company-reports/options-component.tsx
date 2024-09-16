import {OptionsButton} from "@/components/options-button/options-button";
import {MenuItem} from "@mui/material";
import {GoMakeAutoComplate, GoMakeModal} from "@/components";
import {useCallback, useState} from "react";
import {useRecoilState} from "recoil";
import {printHousesState} from "@/pages-components/company-reports/state";
import {PrimaryButton} from "@/components/button/primary-button";
import {useGomakeAxios} from "@/hooks";
import {
    importMachinesApi,
    importMaterialsApi,
    importProfitsApi
} from "@/services/api-service/import-data/import-data-endpoints";
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";

interface IProps {
    printHouseId: string;
}

enum EAction {
    MACHINES,
    PROFITS,
    MATERIALS
}

const OptionsComponent = ({printHouseId}: IProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [actionState, setActionState] = useState<EAction>();
    const [sourcePrintHouseId, setSourcePrintHouseId] = useState<string>('');
    const [printHouses] = useRecoilState<{ id: string; name: string }[]>(printHousesState);
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();

    const handleOptionClick = (action: EAction) => {
        setActionState(action)
        setOpenModal(true);
    }

    const handleModalClose = () => {
        setActionState(null);
        setOpenModal(false)
    }

    const callBack = res => {
        if (res.success) {
            handleModalClose();
        } else {

        }
    }

    const handelImportClick = useCallback(async () => {
        if (actionState === EAction.PROFITS) {
            await handelImportProfits();
        } else if (actionState === EAction.MACHINES) {
            await handelImportMachines();
        } else if (actionState === EAction.MATERIALS) {
            await handelImportMaterials();
        }
    }, [actionState])

    const handelImportMachines = async () => {
        await importMachinesApi(callApi, callBack, {source: sourcePrintHouseId, destination: printHouseId})
    }
    const handelImportProfits = async () => {
        await importProfitsApi(callApi, callBack, {source: sourcePrintHouseId, destination: printHouseId})
    }
    const handelImportMaterials = async () => {
        await importMaterialsApi(callApi, callBack, {source: sourcePrintHouseId, destination: printHouseId})
    }
    return <>
        <OptionsButton>
            <MenuItem onClick={() => handleOptionClick(EAction.PROFITS)}>{t('importData.importProfits')}</MenuItem>
            <MenuItem onClick={() => handleOptionClick(EAction.MATERIALS)}>{t('importData.importMaterials')}</MenuItem>
            <MenuItem onClick={() => handleOptionClick(EAction.MACHINES)}>{t('importData.importMachines')}</MenuItem>
        </OptionsButton>
        <GoMakeModal modalTitle={t('importData.selectPrintHouse')} insideStyle={{width: '400px', height: 'fit-content'}} openModal={openModal} onClose={handleModalClose}>
            <Stack gap={'10px'}>
                <h5>{t('importData.printHouses')}</h5>
            <GoMakeAutoComplate placeholder={t('importData.selectPrintHouse')} options={printHouses.map(p => ({label: p.name, ...p}))}
                                onChange={(e, v) => setSourcePrintHouseId(v.id)}/>
            <PrimaryButton variant={'contained'} onClick={handelImportClick}>{t('importData.import')}</PrimaryButton>
            </Stack>
        </GoMakeModal>
    </>
}

export {OptionsComponent}