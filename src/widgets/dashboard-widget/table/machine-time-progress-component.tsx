import React from "react";
import {useTranslation} from "react-i18next";

interface IProps {
    total: number;
    done: number;
}

const MachineTimeProgressComponent = ({done, total}: IProps) => {
    const {t} = useTranslation();
    const isInHourFormat = total > 60;
    const minToHour = (time) => {
        return time / 60
    }
    return (
        <span>{isInHourFormat ? minToHour(done).toFixed(1) : done}/{isInHourFormat ? minToHour(total).toFixed(1): total }
            <small>{isInHourFormat ? t('measurementUnits.shortHours') : t('measurementUnits.shortMinute')}</small>
        </span>
    )
};

export {MachineTimeProgressComponent};