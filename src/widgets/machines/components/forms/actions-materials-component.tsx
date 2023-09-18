import {useStyle} from "@/widgets/machines/components/forms/style";
import {NavigationButtons} from "@/widgets/machines/components/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {useEffect, useState} from "react";
import {useGomakeAxios} from "@/hooks";
import {Grid} from "@mui/material";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {CheckBoxList} from "@/widgets/machines/components/list/check-box-list";
import {useRecoilValue} from "recoil";
import {machineState as STATE} from "@/widgets/machines/state/machine-state";


const ActionsMaterialsComponent = ({
                                       navigateBack,
                                       navigateNext,
                                       hasBack,
                                       hasNext,
                                       canAddMachine,
                                       canUpdate,
                                       onClickAdd,
                                       onClickUpdate
                                   }: IStepFormProps) => {
    const {classes} = useStyle();
    const machineState = useRecoilValue(STATE);
    const {changeMachineAttributes} = useMachineAttributes();
    const {callApi} = useGomakeAxios();
    const [actions, setActions] = useState([]);
    const [machineActions, setMachineActions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [machineMaterials, setMachineMaterials] = useState([]);

    const {t} = useTranslation();
    useEffect(() => {
        callApi('GET', '/v1/printhouse-config/actions/get-all-actions').then((res) => {
            if (res?.success) {
                if (res?.data?.data?.data) {
                    const data = res?.data?.data?.data;
                    const apiActions = data.map(action => ({...action, checked: false}));
                    if (machineState?.attributes?.actions) {
                        setActions(apiActions.filter(action => !machineState?.attributes?.actions.includes(action.id)));
                        setMachineActions(apiActions.filter(action => machineState?.attributes?.actions.includes(action.id)));
                    } else {
                        setActions(apiActions);
                    }
                }
            }
        });
        callApi('GET', '/v1/administrator/get-all-materials').then((res) => {
            if (res?.success) {
                if (res?.data?.data?.data) {
                    const apiMaterials = Object.entries(res?.data?.data?.data).map(([key, value]) => ({
                        id: key,
                        name: value,
                        checked: false
                    }));
                    if (machineState?.attributes?.materials) {
                        setMaterials(apiMaterials.filter(material => !machineState?.attributes?.materials.includes(material.id)));
                        setMachineMaterials(apiMaterials.filter(material => machineState?.attributes?.materials.includes(material.id)));
                    } else {
                    setMaterials(apiMaterials);
                    }
                }
            }
        });
    }, []);
    useEffect(() => {
        changeMachineAttributes('actions', machineActions.map(action => action.id));
    }, [machineActions])
    useEffect(() => {
        changeMachineAttributes('materials', machineMaterials.map(material => material.id));
    }, [machineMaterials])
    const onClickBack = () => {
        navigateBack();
    }
    const onClickNext = () => {
        onClickNext()
    }

    const handleUpdate = () => {
        onClickUpdate()
    };
    const handleAddMachine = () => {
        onClickAdd();
    };

    const handleCheckAction = (id: string) => {
        const updatedActions = actions.map(action => {
            if (action.id === id) {
                return {
                    ...action,
                    checked: !action.checked
                }
            } else {
                return action;
            }
        })
        setActions(updatedActions);
    };

    const handleCheckMachineAction = (id: string) => {
        const updatedMachineActions = machineActions.map(action => {
            if (action.id === id) {
                return {
                    ...action,
                    checked: !action.checked
                }
            } else {
                return action;
            }
        })
        setMachineActions(updatedMachineActions);
    };

    const handleCheckMaterial = (id: string) => {
        const updatedMaterials = materials.map(material => {
            if (material.id === id) {
                return {
                    ...material,
                    checked: !material.checked
                }
            } else {
                return material;
            }
        })
        setMaterials(updatedMaterials);
    };

    const handleCheckMachineMaterial = (id: string) => {
        const updatedMachineMaterials = machineMaterials.map(material => {
            if (material.id === id) {
                return {
                    ...material,
                    checked: !material.checked
                }
            } else {
                return material;
            }
        })
        setMachineMaterials(updatedMachineMaterials);
    };

    const moveCheckedActionsToRelatedActions = () => {
        setMachineActions(machineActions.concat(actions.filter(a => a.checked)).map(item => ({...item, checked: false})));
        setActions(actions.filter(a => !a.checked));
    }

    const moveCheckedRelatedActionsTActions = () => {
        setActions(actions.concat(machineActions.filter(a => a.checked)).map(item => ({...item, checked: false})));
        setMachineActions(machineActions.filter(a => !a.checked).map(item => ({...item, checked: false})));
    }
    const moveCheckedMaterialsToMachineMaterials = () => {
        setMachineMaterials(machineMaterials.concat(materials.filter(m => m.checked)).map(item => ({...item, checked: false})));
        setMaterials(materials.filter(m => !m.checked).map(item => ({...item, checked: false})));
    }

    const moveCheckedMachineMaterialsToMaterials = () => {
        setMaterials(materials.concat(machineMaterials.filter(m => m.checked)).map(item => ({...item, checked: false})));
        setMachineMaterials(machineMaterials.filter(m => !m.checked).map(item => ({...item, checked: false})));
    }

    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>
                        <h3>{t('machineAttributes.actions')}</h3>
                        {CheckBoxList(actions, handleCheckAction)}
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{my: 0.5}}
                                variant="outlined"
                                size="small"
                                onClick={moveCheckedActionsToRelatedActions}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{my: 0.5}}
                                variant="outlined"
                                size="small"
                                onClick={moveCheckedRelatedActionsTActions}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <h3>{t('machineAttributes.machineActions')}</h3>
                        {CheckBoxList(machineActions, handleCheckMachineAction)}
                    </Grid>
                    <Grid item>
                        <h3>{t('machineAttributes.materialsList')}</h3>
                        {CheckBoxList(materials, handleCheckMaterial)}
                    </Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{my: 0.5}}
                                variant="outlined"
                                size="small"
                                onClick={moveCheckedMaterialsToMachineMaterials}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{my: 0.5}}
                                variant="outlined"
                                size="small"
                                onClick={moveCheckedMachineMaterialsToMaterials}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <h3>{t('machineAttributes.machineMaterialsList')}</h3>
                        {CheckBoxList(machineMaterials, handleCheckMachineMaterial)}
                    </Grid>
                </Grid>
            </div>
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/></div>
    );
}

export {ActionsMaterialsComponent};