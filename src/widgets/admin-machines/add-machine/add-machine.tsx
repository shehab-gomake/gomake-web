import {useStyle} from "@/widgets/admin-machines/add-machine/style";
import {useRouter} from "next/router";
import {useRecoilValue} from "recoil";
import {machineCategoriesState} from "@/store/machine-categories";
import {getSteps} from "@/widgets/admin-machines/add-machine/steps";
import {Step, StepContent, Stepper} from "@mui/material";
import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {ReactNode, useEffect, useState} from "react";
import {useAddMachine} from "@/widgets/admin-machines/hooks/use-add-machine";
import {StyledStepLabel} from "@/widgets/admin-machines/components/step-label";
import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";

const AddMachine = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const {classes} = useStyle();
    const router = useRouter();
    const {categoryId} = router.query;
    const categories = useRecoilValue(machineCategoriesState);
    const categoryName = !!categoryId ? categories.find(category => category.id === categoryId)?.name : null;
    const machineSteps = getSteps(categoryId as ECategoryId);
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
                                <StyledStepLabel {...labelProps}>
                                        <span style={classes.stepLabel}>{step.label}</span>
                                </StyledStepLabel>
                                <StepContent style={classes.stepContainer}>
                                    <step.component navigateBack={navigateBack}
                                                    navigateNext={navigateNext}
                                                    canAddMachine={activeStep + 1 === machineSteps.length}
                                                    canUpdate={false}
                                                    onClickAdd={onClickAddMachine}
                                                    onClickUpdate={() =>{}}
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
export {AddMachine}