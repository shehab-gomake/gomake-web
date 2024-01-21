import {useTranslation} from "react-i18next";

const rollFinishUnits = () => {
    const {t} = useTranslation();
    return [
        {value: 1, text: t('rollFinishUnits.dieKissCutUnit')},
        {value: 2, text: t('rollFinishUnits.laserCutUnit')},
        {value: 3, text: t('rollFinishUnits.laminationUnit')},
        {value: 4, text: t('rollFinishUnits.varnishUnit')},
        {value: 5, text: t('rollFinishUnits.foilUnit')},
        {value: 6, text: t('rollFinishUnits.embossingSelectiveUnit')},

    ]

}
export {rollFinishUnits}