import {atom} from "recoil";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

export const machineCategoriesState = atom({
    key: "machinesCategoryState",
    default: [
        {id: ECategoryId.DIGITAL_PRINTING, name: 'Digital Printing'},
        {id: ECategoryId.OFSSET_PRINTING, name: 'Ofsset Printing'},
        {id: ECategoryId.ROLL_DIGITAL_PRINTING, name: 'Roll Digital'},
        {id: ECategoryId.FLEXO_PRINTING, name: 'Flexo Printing'},
        {id: ECategoryId.CATEGORY5, name: 'category 5'},
        {id: ECategoryId.CATEGORY6, name: 'category 6'},
        {id: ECategoryId.CATEGORY7, name: 'category 7'},
        {id: ECategoryId.CATEGORY8, name: 'category 8'},
        {id: ECategoryId.CATEGORY9, name: 'category 9'},
        {id: ECategoryId.CATEGORY10, name: 'category 10'},
        {id: ECategoryId.CATEGORY11, name: 'category 11'},
        {id: ECategoryId.CATEGORY12, name: 'category 12'},
        {id: ECategoryId.CATEGORY13, name: 'category 13'},
        {id: ECategoryId.CATEGORY14, name: 'category 14'},
    ],
});
