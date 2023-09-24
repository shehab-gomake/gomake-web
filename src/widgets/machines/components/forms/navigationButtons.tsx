import {useStyle} from "@/widgets/machines/components/forms/style";
import {GomakePrimaryButton} from "@/components";
import {SecondaryButton} from "@/components/button/secondary-button";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();
    return (
        <div style={classes.navigationButtons}>
            {hasBack && <SecondaryButton variant={'outlined'} onClick={onClickBack}>{t('navigationButtons.back')}</SecondaryButton>}
            {canUpdate &&
                <GomakePrimaryButton style={classes.actionButton} onClick={onClickUpdate}>{t('navigationButtons.update')}</GomakePrimaryButton>}
            {canAddMachine && <GomakePrimaryButton style={classes.actionButton} onClick={onClickAddMachine}>{t('navigationButtons.add')}</GomakePrimaryButton>}
            {hasNext && <SecondaryButton variant={'contained'} onClick={onClickNext}>{t('navigationButtons.next')}</SecondaryButton>}
        </div>
    );
}

export {NavigationButtons};