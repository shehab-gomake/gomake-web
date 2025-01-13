import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const pressMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
    ]
}

export {pressMachine};