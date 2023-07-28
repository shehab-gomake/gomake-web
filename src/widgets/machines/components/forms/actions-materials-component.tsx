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
    const {machineCuttingOptionsAttributes, isValidStep, changeMachineAttributes} = useMachineAttributes();
    const {callApi} = useGomakeAxios();
    const [actions, setActions] = useState([]);
    const [relatedActions, setRelatedActions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [machineMaterials, setMachineMaterials] = useState([]);

    const {t} = useTranslation();
    useEffect(() => {
        callApi('GET', '/v1/printhouse-config/actions/get-all-actions').then((res) => {
            if (res?.success) {
                if (res?.data?.data?.data) {
                    const apiActions = res?.data?.data?.data.map(action => ({...action, checked: false}));
                    setActions(apiActions);
                }
            }
        });
        callApi('GET', '/v1/administrator/get-all-materials').then((res) => {
            if (res?.success) {
                if (res?.data?.data?.data) {
                    const apiMaterials = res?.data?.data?.data.map(material => ({id: material, name: material, checked: false}));
                    setMaterials(apiMaterials);
                }
            }
        });
    }, []);
    useEffect(() => {
        changeMachineAttributes('actions', relatedActions.map(action => action.id));
    }, [relatedActions])
    const onClickBack = () => {
        navigateBack();
    }
    const onClickNext = () => {
        const validStep = isValidStep(machineCuttingOptionsAttributes());
        if (validStep) {
            navigateNext();
        }
    }

    const handleUpdate = () => {
        const validStep = isValidStep(machineCuttingOptionsAttributes());
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep(machineCuttingOptionsAttributes());
        if (validStep) {
            onClickAdd();
        }
    };

    const handleCheckActions = (id: string) =>  {
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

    const handleCheckRelatedActions = (id: string) =>  {
        const updatedRelatedActions = relatedActions.map(action => {
            if (action.id === id) {
                return {
                    ...action,
                    checked: !action.checked
                }
            } else {
                return action;
            }
        })
        setRelatedActions(updatedRelatedActions);
    };

    const handleCheckMaterials = (id: string) =>  {
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

    const handleCheckMachineMaterials = (id: string) =>  {
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
        setRelatedActions(relatedActions.concat(actions.filter(a => a.checked)));
        setActions(actions.filter(a => !a.checked));
    }

    const moveCheckedRelatedActionsTActions = () => {
        setActions(actions.concat(relatedActions.filter(a => a.checked)));
        setRelatedActions(relatedActions.filter(a => !a.checked));
    }
    const moveCheckedMaterialsToMachineMaterials = () => {
        setMachineMaterials(machineMaterials.concat(materials.filter(m => m.checked)));
        setMaterials(materials.filter(m => !m.checked));
    }

    const moveCheckedMachineMaterialsToMaterials = () => {
        setMaterials(materials.concat(machineMaterials.filter(m => m.checked)));
        setMachineMaterials(machineMaterials.filter(m => !m.checked));
    }

    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>
                        <h3>{t('machineAttributes.actions')}</h3>
                        {CheckBoxList(actions, handleCheckActions)}
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
                        {CheckBoxList(relatedActions, handleCheckRelatedActions)}
                    </Grid>
                    <Grid item>
                        <h3>{t('Materials')}</h3>
                        {CheckBoxList(materials, handleCheckMaterials)}
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
                        <h3>{t('machineAttributes.machineActions')}</h3>
                        {CheckBoxList(machineMaterials, handleCheckMachineMaterials)}
                    </Grid>
                </Grid>
            </div>
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/></div>
    );
}

export {ActionsMaterialsComponent};