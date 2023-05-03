import {useStyle} from "@/widgets/admin-machines/add-machine/style";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {getSteps} from "@/widgets/admin-machines/add-machine/steps";
import {Step, StepContent, Stepper} from "@mui/material";
import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {ReactNode, useEffect, useState} from "react";
import {useUpdateMachine} from "@/widgets/admin-machines/hooks/use-update-machine";
import {StyledStepLabel} from "@/widgets/admin-machines/components/step-label";
import {useTranslation} from "react-i18next";

const UpdateMachine = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const {t} = useTranslation();
    const categories = useRecoilValue(machineCategoriesState);
    const [categoryName, setCategoryName] = useState<string>();
    const [machineSteps, setMachineSteps] = useState<IStep[]>([]);
    const {classes} = useStyle();
    const {updateMachine, machineCategoryId} = useUpdateMachine();

    useEffect(() => {
        if (machineCategoryId()) {
            console.log(machineCategoryId())
            const category = categories.find(category => category.id == machineCategoryId())
            setCategoryName(category?.name ? category?.name : '' );
            if (category) setMachineSteps(getSteps(category.id));
        }
    }, [machineCategoryId()]);
    const navigateBack = () => {
        setActiveStep(activeStep - 1);
    }
    const navigateNext = () => {
        setActiveStep(activeStep + 1);
    }

    useEffect(() => {console.log(machineSteps)}, [machineSteps])
    return (
        <div>
            <h2>{`Update ${categoryName} machine`}</h2>
            <div>
                <Stepper connector={null} color={undefined} activeStep={activeStep} orientation="vertical">
                    {machineSteps.map((step: IStep, index: number) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: { optional?: ReactNode; } = {};
                        return (
                            <Step key={step.label} {...stepProps}>
                                <StyledStepLabel {...labelProps}>
                                    <span style={classes.stepLabel}>{t('machineSteps.' + step.label)}</span>
                                </StyledStepLabel>
                                <StepContent style={{border: 0}}>
                                    <step.component navigateBack={navigateBack}
                                                    navigateNext={navigateNext}
                                                    onClickUpdate={updateMachine}
                                                    onClickAdd={() => {}}
                                                    canUpdate={true}
                                                    canAddMachine={false}
                                                    hasBack={index > 0}
                                                    hasNext={index + 1 < machineSteps.length}/>
                                </StepContent>
                            </Step>
                        )
                    })}
                </Stepper>
            </div>
        </div>
    );
}
export {UpdateMachine}