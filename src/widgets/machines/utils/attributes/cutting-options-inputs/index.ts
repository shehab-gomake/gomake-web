import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {bookletMachine} from "@/widgets/machines/utils/attributes/cutting-options-inputs/booklet-machine";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/cutting-options-inputs/book-binder-machine";


const getCategoryCuttingOptionsInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.BOOKLET_MACHINE:
            return bookletMachine(state);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return bookBinderMachine(state);
        default:
            return []
    }
}

export {getCategoryCuttingOptionsInputs};