import {atom} from "recoil";
import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";

export const machineCategoriesState = atom({
    key: "machinesCategoryState",
    default: [
        {id: ECategoryId.DIGITAL_PRINTING, name: 'Digital Printing'},
        {id: ECategoryId.CATEGORY2, name: 'category 2'},
        {id: ECategoryId.CATEGORY3, name: 'category 3'},
        {id: ECategoryId.CATEGORY4, name: 'category 4'},
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
