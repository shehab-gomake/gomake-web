import {useAddPrintingMachine} from "@/widgets/add-machine/utils/use-add-printing-machine";
import {ReactNode, useState} from "react";
import {Step, StepContent, StepIcon, StepLabel, Stepper} from "@mui/material";
import {printingMachineSteps} from "@/widgets/add-machine/utils/steps";
import {useStyle} from "@/widgets/add-machine/style";
import {IStep} from "@/widgets/add-machine/interface/step";
import {GomakePrimaryButton} from "@/components";
import Button from "@mui/material/Button";

const PrintingMachineForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const {classes} = useStyle();
    const {
        changeState,
        errors,
        onClickAddMachine,
    } = useAddPrintingMachine();
    return (
        <div>
            <Stepper activeStep={activeStep} orientation="vertical">
                {printingMachineSteps.map((step: IStep, index: number) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: ReactNode; } = {};
                    return (
                        <Step key={step.label} {...stepProps}>
                            <StepLabel {...labelProps}>
                                <div style={classes.stepLabelContainer}>
                                    <span style={classes.stepLabel}>{step.label}</span>
                                </div>
                            </StepLabel>
                            <StepContent>
                                {step.component()}
                                <div style={classes.navigationButtons}>
                                    {activeStep > 0 ?
                                        <Button color={"secondary"}  onClick={() => setActiveStep(activeStep - 1)}>Back</Button> :
                                        <div></div>}
                                    {activeStep + 1 < printingMachineSteps.length ?
                                        <Button variant={"outlined"} color={"success"}  onClick={() => setActiveStep(activeStep + 1)}>Next</Button> :
                                        <div></div>}
                                </div>
                            </StepContent>
                        </Step>
                    );
                })}
            </Stepper>
        </div>

    );
}
export {PrintingMachineForm};