import Button from "@mui/material/Button";
import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {styled} from "@mui/material/styles";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {GomakePrimaryButton} from "@/components";

const NextButton = styled(Button)((props: any) => ({
    boxShadow: "none",
    textTransform: "none",
    padding: "10px 32px",
    lineHeight: "1.5px",
    height: 40,
    width: 99,
    backgroundColor: '#ED028C',
    borderRadius: 4,
    gap: 7,
    color: "#FFFFFF",
    "&:hover": {
        letterSpacing: "0.1em",
        backgroundColor: '#ED028C',
    },
    transition: "0.25s",
    ...FONT_FAMILY.Lexend(500, 16),
}));

const PreviousButton = styled(Button)((props: any) => {
    const {primaryColor} = useGomakeTheme();

    return {
        boxShadow: "none",
        textTransform: "none",
        padding: "10px 32px",
        lineHeight: "1.5px",
        height: 40,
        width: 99,
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        border: 'solid 1px' + primaryColor(500),
        gap: 7,
        color: primaryColor(500),
        "&:hover": {
            letterSpacing: "0.1em",
            backgroundColor: "#FFFFFF",
        },
        transition: "0.25s",
        ...FONT_FAMILY.Lexend(500, 16),
    }
});
const NavigationButtons = ({
                               onClickNext,
                               onClickBack,
                               onClickUpdate,
                               onClickAddMachine,
                               hasBack = true,
                               hasNext = true,
                               canUpdate,
                               canAddMachine
                           }: {
    onClickNext: () => void,
    onClickBack: () => void,
    onClickUpdate: () => void,
    onClickAddMachine: () => void,
    hasBack: boolean,
    hasNext: boolean,
    canUpdate: boolean,
    canAddMachine: boolean,
}) => {
    const {classes} = useStyle();
    return (
        <div style={classes.navigationButtons}>
            <div>
                {hasBack && <PreviousButton onClick={onClickBack}>Back</PreviousButton>}
            </div>
            <div>
                {canUpdate &&
                    <GomakePrimaryButton style={{height: 40}} onClick={onClickUpdate}>Update</GomakePrimaryButton>}
                {canAddMachine && <GomakePrimaryButton style={{height: 40}} onClick={onClickAddMachine}>Add
                    machine</GomakePrimaryButton>}

            </div>
            <div>
                {hasNext && <NextButton onClick={onClickNext}>Next</NextButton>}
            </div>
        </div>
    );
}

export {NavigationButtons};