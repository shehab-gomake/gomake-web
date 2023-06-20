import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {bookletMachine} from "@/widgets/machines/utils/attributes/other-setting/booklet-machine";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/other-setting/book-binder-machine";
import {spiralClosingMachine} from "@/widgets/machines/utils/attributes/other-setting/spiral-closing-machine";


const getCategoryInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.BOOKLET_MACHINE:
            return bookletMachine(state);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return bookBinderMachine(state);
        case ECategoryId.SPIRAL_CLOSING_MACHINE:
            return spiralClosingMachine(state);
        default:
            return []
    }
}

export {getCategoryInputs};