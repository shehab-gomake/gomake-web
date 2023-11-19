import {digitalPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/digital-printing";

const rollDigitalPrinting = (state: Record<string, any>) => {
    return [
        ...digitalPrinting(state)
    ]
}

export {rollDigitalPrinting};