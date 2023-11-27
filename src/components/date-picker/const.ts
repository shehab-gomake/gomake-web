import {endOfToday, startOfMonth, endOfMonth} from "date-fns";

const staticDateRange = [
    {
        label: 'datepicker.today',
        range: () => (TODAY),
        isSelected: ()=> false

    },
    {
        label: 'datepicker.thisMonth',
        range: () => (THIS_MONTH),
        isSelected: ()=> false

    },
];

const TODAY = {
    startDate: endOfToday(),
    endDate: endOfToday(),
}



const THIS_MONTH = {
    startDate: startOfMonth(new Date(Date.now())),
    endDate: endOfMonth(new Date(Date.now()))
}
export {staticDateRange}