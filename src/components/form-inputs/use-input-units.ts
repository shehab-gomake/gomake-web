import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {useRecoilValue} from "recoil";
import {userState} from "@/store";


const useInputUnit = () => {
    const user = useRecoilValue<any>(userState);
    const translateUnit: boolean = user?.printHouseProfile?.unitType === 1;
    const units = {
        [EMeasurementUnits.CM]: {
            imperialRatio: 0.3937007874,
            imperialUnit: EMeasurementUnits.INCH
        },
        [EMeasurementUnits.MM]: {
            imperialRatio: 0.03937007874,
            imperialUnit: EMeasurementUnits.INCH
        },
        [EMeasurementUnits.UM]: {
            imperialRatio:39.3701,
            imperialUnit: EMeasurementUnits.PT
        },
        [EMeasurementUnits.METER]: {
            imperialRatio: 39.37007874,
            imperialUnit: EMeasurementUnits.INCH
        },
        [EMeasurementUnits.M]: {
            imperialRatio: 39.37007874,
            imperialUnit: EMeasurementUnits.INCH
        },
        [EMeasurementUnits.GRAM]: {
            imperialRatio: 0.00220462,
            imperialUnit: EMeasurementUnits.LB
        },
        [EMeasurementUnits.KG]: {
            imperialRatio: 2.20462,
            imperialUnit: EMeasurementUnits.LB
        },
        [EMeasurementUnits.PPM]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.PPM
        },
        [EMeasurementUnits.PERCENTAGE]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.PERCENTAGE
        },
        [EMeasurementUnits.MINUTE]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.MINUTE
        },
        [EMeasurementUnits.SECOND]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.SECOND
        },
        [EMeasurementUnits.INCH]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.INCH
        },
        [EMeasurementUnits.SQUARE_METER]: {
            imperialRatio: 10.7639,
            imperialUnit: EMeasurementUnits.SQUARE_FEET
        },
        [EMeasurementUnits.SQUARE_CM]: {
            imperialRatio: 0.00107639,
            imperialUnit: EMeasurementUnits.SQUARE_FEET
        },
        [EMeasurementUnits.CM_PER_SQUARE_CM]: {
            imperialRatio: 0.3937007874,
            imperialUnit: 'inchPerSquareInch' as EMeasurementUnits
        },
        [EMeasurementUnits.SETS_HOUR]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.SETS_HOUR
        },
        [EMeasurementUnits.SPH]: {
            imperialRatio: 1, // Stays the same
            imperialUnit: EMeasurementUnits.SPH
        },
        [EMeasurementUnits.PPH]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.PPH
        },
        [EMeasurementUnits.BOOK_PH]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.BOOK_PH
        },
        [EMeasurementUnits.CHICKS_PM]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.CHICKS_PM
        },
        [EMeasurementUnits.CUTS_PH]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.CUTS_PH
        },
        [EMeasurementUnits.CM_SEC]: {
            imperialRatio: 0.3937007874,
            imperialUnit: EMeasurementUnits.INCH_SEC
        },
        [EMeasurementUnits.MM_P_SECOND]: {
            imperialRatio: 0.03937007874,
            imperialUnit: EMeasurementUnits.INCH_SEC
        },
        [EMeasurementUnits.STAPLES_P_MIN]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.STAPLES_P_MIN
        },
        [EMeasurementUnits.MM_P_MIN]: {
            imperialRatio: 0.03937007874,
            imperialUnit: EMeasurementUnits.INCH_P_MIN
        },
        [EMeasurementUnits.CM_P_MIN]: {
            imperialRatio: 0.3937007874,
            imperialUnit: EMeasurementUnits.INCH_P_MIN
        },
        [EMeasurementUnits.PIERCING_PER_MIN]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.PIERCING_PER_MIN
        },
        [EMeasurementUnits.METER_P_MIN]: {
            imperialRatio: 39.37007874,
            imperialUnit: EMeasurementUnits.INCH_P_MIN
        },
        [EMeasurementUnits.BENDING_P_H]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.BENDING_P_H
        },
        [EMeasurementUnits.BOOKLETS_P_MIN]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.BOOKLETS_P_MIN
        },
        [EMeasurementUnits.BOOKS_P_MIN]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.BOOKS_P_MIN
        },
        [EMeasurementUnits.SETS_MIN]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.SETS_MIN
        },
        [EMeasurementUnits.COVERS_P_H]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.COVERS_P_H
        },
        [EMeasurementUnits.PACKAGE_P_H]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.PACKAGE_P_H
        },
        [EMeasurementUnits.CUTS_P_MIN]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.CUTS_P_MIN
        },
        [EMeasurementUnits.SQUARE_METER_P_MIN]: {
            imperialRatio: 10.7639,
            imperialUnit: EMeasurementUnits.SQUARE_FEET_P_MIN
        },
        [EMeasurementUnits.SQUARE_METER_P_HOUR]: {
            imperialRatio: 10.7639,
            imperialUnit: EMeasurementUnits.SQUARE_FEET_HOUR
        },
        [EMeasurementUnits.SQUARE_CM_P_MIN]: {
            imperialRatio: 0.00107639,
            imperialUnit: EMeasurementUnits.SQUARE_FEET_P_MIN
        },
        [EMeasurementUnits.PAPER_SETS_PER_HOUR]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.PAPER_SETS_PER_HOUR
        },
        [EMeasurementUnits.METER_PER_HOUR]: {
            imperialRatio: 39.37007874,
            imperialUnit: EMeasurementUnits.INCH_PER_HOUR
        },
        [EMeasurementUnits.CUPS_PER_HOUR]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.CUPS_PER_HOUR
        },
        [EMeasurementUnits.SQUARE_CM_HOUR]: {
            imperialRatio: 0.00107639,
            imperialUnit: EMeasurementUnits.SQUARE_FEET_HOUR
        },
        [EMeasurementUnits.LETTERS_PER_HOUR]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.LETTERS_PER_HOUR
        },
        [EMeasurementUnits.PROFILE_PER_HOUR]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.PROFILE_PER_HOUR
        },
        [EMeasurementUnits.UNITS]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.UNITS
        },
        [EMeasurementUnits.GSM]: {
            imperialRatio: 1,
            imperialUnit: EMeasurementUnits.GSM
        }
    };

    const convertUnitValue = (unit: EMeasurementUnits, value: number) => {
        const res = units[unit].imperialRatio * value
        return isNaN(res) ? null : res;
    }

    const restoreUnitValue = (unit: EMeasurementUnits, value: number) => {
        const res = value / units[unit].imperialRatio ;
        return isNaN(res) ? null : res;
    }
    return {
        convertUnitValue,
        restoreUnitValue,
        translateUnit,
        units
    }
}

export {useInputUnit}