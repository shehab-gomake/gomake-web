import {useStyle} from "@/widgets/machines/components/forms/style";
import {GomakePrimaryButton} from "@/components";
import {SecondaryButton} from "@/components/button/secondary-button";

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
            {hasBack && <SecondaryButton variant={'outlined'} onClick={onClickBack}>Back</SecondaryButton>}
            {canUpdate &&
                <GomakePrimaryButton style={classes.actionButton} onClick={onClickUpdate}>Update</GomakePrimaryButton>}
            {canAddMachine && <GomakePrimaryButton style={classes.actionButton} onClick={onClickAddMachine}>Add
                machine</GomakePrimaryButton>}
            {hasNext && <SecondaryButton variant={'contained'} onClick={onClickNext}>Next</SecondaryButton>}
        </div>
    );
}

export {NavigationButtons};