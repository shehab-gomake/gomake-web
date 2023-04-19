import {useStyle} from "@/widgets/admin-machines/add-machine/style";
import {useRouter} from "next/router";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {getSteps} from "@/widgets/admin-machines/add-machine/steps";
import {Step, StepContent, StepLabel, Stepper} from "@mui/material";
import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {ReactNode, useEffect, useState} from "react";
import {GomakePrimaryButton} from "@/components";
import {useAddMachine} from "@/widgets/admin-machines/hooks/use-add-machine";

const AddMachine = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const {classes} = useStyle();
    const router = useRouter();
    const {categoryId} = router.query;
    const categories = useRecoilValue(machineCategoriesState);
    const categoryName = !!categoryId ? categories.find(category => category.id === categoryId)?.name : null;
    const machineSteps = getSteps(categoryId);
    const {onClickAddMachine} = useAddMachine();
    const navigateBack = () => {
        setActiveStep(activeStep - 1);
    }
    const navigateNext = () => {
        setActiveStep(activeStep + 1);
    }
    useEffect(() => {
    },[])
    return (
        <div>
            <h2>{`Add ${categoryName} machine`}</h2>
            <div>
                <Stepper connector={null}   activeStep={activeStep} orientation="vertical">
                    {machineSteps.map((step: IStep, index: number) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: { optional?: ReactNode; } = {};
                        return (
                            <Step key={step.label} {...stepProps}>
                                <StepLabel {...labelProps}>
                                    <div style={classes.stepLabelContainer}>
                                        <span style={classes.stepLabel}>{step.label}</span>
                                    </div>
                                </StepLabel>
                                <StepContent style={{border: 0}}>
                                    <step.component navigateBack={navigateBack} navigateNext={navigateNext} hasBack={index > 0} hasNext={index + 1 < machineSteps.length}/>
                                {activeStep + 1 === machineSteps.length && <GomakePrimaryButton onClick={onClickAddMachine}>submit</GomakePrimaryButton>}
                                </StepContent>
                            </Step>
                        )
                    })}
                </Stepper>
            </div>
        </div>
    );
}
export {AddMachine}