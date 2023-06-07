import {atom} from "recoil";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

export const machineCategoriesState = atom({
    key: "machinesCategoryState",
    default: [
        {id: ECategoryId.DIGITAL_PRINTING, name: 'Digital Printing'},
        {id: ECategoryId.OFSSET_PRINTING, name: 'Ofsset Printing'},
        {id: ECategoryId.ROLL_DIGITAL_PRINTING, name: 'Roll Digital'},
        {id: ECategoryId.FLEXO_PRINTING, name: 'Flexo Printing'},
        {id: ECategoryId.ROLL_WIDE_PRINTING, name: 'Roll wide printing'},
        {id: ECategoryId.FLATBED_WIDE_PRINTING, name: 'Flatbed wide printing'},
        {id: ECategoryId.LAMINATION_MACHINE, name: 'Lamination machine'},
        {id: ECategoryId.PUNCHING_MACHINE, name: 'Punching machine'},
        {id: ECategoryId.ROUNDING_CORNERS_MACHINE, name: 'Rounding corners machine'},
        {id: ECategoryId.CATEGORY10, name: 'category 10'},
        {id: ECategoryId.CATEGORY11, name: 'category 11'},
        {id: ECategoryId.CATEGORY12, name: 'category 12'},
        {id: ECategoryId.CATEGORY13, name: 'category 13'},
        {id: ECategoryId.CATEGORY14, name: 'category 14'},
    ],
});
