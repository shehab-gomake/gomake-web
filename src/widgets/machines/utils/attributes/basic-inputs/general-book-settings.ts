import {feedOptions} from "@/widgets/machines/utils/const/feed-options";
import {generalBasicSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-basic-settings";

const generalBookSettings = (state: Record<string, any>) => {
    return [
        ...generalBasicSettings(state),
        {
            name: "feedOption",
            label: "machineAttributes.feedOption",
            type: "select",
            placeholder: "machineAttributes.feedOption",
            required: true,
            parameterKey: "feedOption",
            value: state.attributes?.feedOption,
            options: feedOptions,
            machineInputType: 'input',
            isValid: true,
        },
    ];
}

export {generalBookSettings};