import {styled} from "@mui/material/styles";
import {Step, StepContent, StepLabel, StepLabelProps, Stepper} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {ReactNode} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowRight";
import {IMachineStepperProps} from "@/widgets/machines/components/stepper/interface";
import {useStyle} from "@/widgets/machines/components/stepper/style";
import {useTranslation} from "react-i18next";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
const StyledStepLabel = styled(StepLabel)((props: StepLabelProps) => {
    const {secondColor, neutralColor} = useGomakeTheme();
    return {
        '& .Mui-disabled': {
            span: {
                ...FONT_FAMILY.Lexend(600, 16),
                color: neutralColor(500),
            },
            color: neutralColor(500),
            '& .MuiStepIcon-root': {
                color: neutralColor(500),
            },
        },

        '& .Mui-active': {
            span: {
                ...FONT_FAMILY.Lexend(600, 16),
                color: neutralColor(800),
            },
            color: neutralColor(800),
            '& .MuiStepIcon-root': {
                color: neutralColor(800),
            },
        },
        '& .Mui-completed > *': {

            span: {
                ...FONT_FAMILY.Lexend(500, 16),
                color: secondColor(500)
            },
            color: secondColor(500),
        },
    }
});

const ArrowIconDirection = () => {
    const {t} = useTranslation();
    const direction: 'rtl' | 'ltr' = t('direction');
    return direction === "ltr" ? <KeyboardArrowDownIcon color={'inherit'}/> : <NavigateBeforeIcon/>
}

const MachineStepper = ({
                            steps,
                            activeStep,
                            previousStep,
                            nextStep,
                            actionButtonClicked,
                            isAddForm,
                            moveToStep
                        }: IMachineStepperProps) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    return (
        <Stepper connector={null} activeStep={activeStep} orientation="vertical">
            {steps.map((step: IStep, index: number) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: ReactNode; } = {};
                return (
                    <Step  key={step.label} {...stepProps}>
                        <StyledStepLabel
                            onClick={()=> {moveToStep && moveToStep(index)}}
                            style={activeStep === index ? classes.activeStepLabel : {cursor: 'pointer'}} {...labelProps}>
                            <div style={classes.stepLabel}>
                                <span style={classes.stepLabelText}>{t('machineSteps.' + step.label)}</span>
                                {activeStep === index ? <ExpandMoreIcon color={'inherit'}/> :
                                    <ArrowIconDirection/>}
                            </div>
                        </StyledStepLabel>
                        <StepContent style={classes.stepContainer}>
                            <step.component navigateBack={previousStep}
                                            navigateNext={nextStep}
                                            canAddMachine={isAddForm ? activeStep + 1 === steps.length : false}
                                            canUpdate={!isAddForm}
                                            onClickAdd={actionButtonClicked}
                                            onClickUpdate={actionButtonClicked}
                                            hasBack={index > 0}
                                            hasNext={index + 1 < steps.length}/>
                        </StepContent>
                    </Step>
                )
            })}
        </Stepper>
    );
}

export {StyledStepLabel, MachineStepper}