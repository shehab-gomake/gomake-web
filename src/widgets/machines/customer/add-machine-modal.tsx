import Stack from "@mui/material/Stack";
import {useEffect, useState} from "react";
import {PrimaryButton} from "@/components/button/primary-button";
import {printHouseAddNewMachine} from "@/services/api-service/machines/print-house-machines";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";
import {useRecoilState} from "recoil";
import {machinesListState} from "@/widgets/machines/state/machines";
import {useTranslation} from "react-i18next";
import {getCategoryManufacturers, getManufacturerModels} from "@/services/api-service/machines/admin-machines";
import {Autocomplete} from "@mui/material";
import {StyledTextField} from "@/components";

interface IAddMachine {
    manufacturer: string;
    model: string;
}

const AddMachineModal = ({closeModal}: { closeModal: () => void }) => {
    const {callApi} = useGomakeAxios();
    const router = useRouter();
    const {categoryId} = router.query;
    const [machines, setMachines] = useRecoilState(machinesListState);
    const [manufacturers, setManufacturers] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [state, setState] = useState<IAddMachine>({model: '', manufacturer: ''});
    const {alertFaultAdded, alertSuccessAdded, setSnackbarStateValue} = useSnackBar();
    const {t} = useTranslation();
    const manufacturersCallBack = (res) => {
        if (res.success) {
            setManufacturers(res.data);
        }
    }

    const modelsCallBack = (res) => {
        if (res.success) {
            setModels(res.data);
        }
    }
    useEffect(() => {
        getCategoryManufacturers(callApi, manufacturersCallBack, categoryId).then();
    }, [categoryId])

    useEffect(() => {
        if (state.manufacturer && manufacturers.includes(state.manufacturer)) {
            getManufacturerModels(callApi, modelsCallBack, {
                category: categoryId,
                manufacturer: state.manufacturer
            }).then();
        }
    }, [state])

    const onAddMachine = async () => {

        if (!state.manufacturer || !state.model) {
            setSnackbarStateValue({
                state: true,
                message: t("modal.addMachinesInputRequired"),
                type: "error",
            });
            return;
        }
        const callBack = (res) => {
            if (res.success) {
                setMachines([...machines, res.data]);
                alertSuccessAdded();
                closeModal();
            } else {
                alertFaultAdded()
            }
        }
        await printHouseAddNewMachine(callApi, callBack, {...state, category: categoryId});
    }

    return (
        <Stack gap={'30px'}>
            <Stack direction={'row'} gap={'10px'} flexWrap={'wrap'}>
                <Stack width={'200px'} gap={'5px'}>
                    <h5>{t('machineAttributes.manufacturer')}</h5>
                    <Autocomplete
                        fullWidth
                        // style={{border: '1px solid black', padding: '5px 0'}}
                        id="free-solo-demo"
                        freeSolo
                        onChange={(e, m) => setState(prevState => ({...prevState, manufacturer: m}))}
                        options={state.manufacturer?.length > 1 ? manufacturers : []}
                        renderInput={(params) => <StyledTextField  {...params} style={{height: '40px'}}
                                                             onChange={(e) => setState(prevState => ({
                            ...prevState,
                            manufacturer: e.target.value
                        }))}/>}
                    />
                </Stack>
                <Stack width={'200px'} gap={'5px'}>
                    <h5>{t('machineAttributes.model')}</h5>
                    <Autocomplete
                        fullWidth
                        id="free-solo-demo"
                        freeSolo
                        options={state.model.length > 1 ? models : []}
                        onChange={(e, m) => setState(prevState => ({...prevState, model: m}))}
                        renderInput={(params) => <StyledTextField  {...params} style={{height: '40px'}}
                                                             onChange={(e) => setState(prevState => ({
                            ...prevState,
                            model: e.target.value
                        }))}/>}
                    />
                </Stack>
            </Stack>
            <PrimaryButton onClick={onAddMachine} variant={'contained'}>{t('navigationButtons.add')}</PrimaryButton>
        </Stack>
    )
}

export {AddMachineModal}