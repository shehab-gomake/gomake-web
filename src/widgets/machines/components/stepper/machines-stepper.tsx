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

const StyledStepLabel = styled(StepLabel)((props: StepLabelProps) => {
    const {primaryColor, secondColor, neutralColor} = useGomakeTheme();
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
            color: secondColor(500),
            '& .MuiStepIcon-root': {
                color: neutralColor(800),
            },
        },
        '& .Mui-completed': {
            span: {
                ...FONT_FAMILY.Lexend(500, 16),
                color: primaryColor(500)
            },
            color: primaryColor(500),
        },
    }
});

const MachineStepper = ({steps, activeStep, previousStep, nextStep, actionButtonClicked, isAddForm}: IMachineStepperProps) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    return (
        <Stepper connector={null} activeStep={activeStep} orientation="vertical">
            {steps.map((step: IStep, index: number) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: ReactNode; } = {};
                return (
                    <Step key={step.label} {...stepProps}>
                        <StyledStepLabel
                            style={activeStep === index ? classes.activeStepLabel : {}} {...labelProps}>
                            <div style={classes.stepLabel}>
                                <span>{t('machineSteps.' + step.label)}</span>
                                {activeStep === index ? <ExpandMoreIcon color={'inherit'}/> :
                                    <KeyboardArrowDownIcon color={'inherit'}/>}
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