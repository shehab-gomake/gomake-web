import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/unwinder-rewinder/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/unwinder-rewinder/flexo-printing";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/unwinder-rewinder/book-binder-machine";

const getCategoryUnWinderInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrinting(state);
        case ECategoryId.FLEXO_PRINTING:
            return flexoPrinting(state);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return bookBinderMachine(state)
        default:
            return []
    }
}

export {getCategoryUnWinderInputs};