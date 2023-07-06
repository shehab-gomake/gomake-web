import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const bookSewingMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToCollectorMachine', ECategoryId.COLLECTOR, 'connectToCollectorMachine'),
    ];
}

export {bookSewingMachine};