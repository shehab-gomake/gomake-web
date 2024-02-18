import {feedOptions} from "@/widgets/machines/utils/const/feed-options";
import {generalBasicSettings} from "@/widgets/machines/utils/attributes/basic-inputs/general-basic-settings";
import { useTranslation } from "react-i18next";

const generalBookSettings = (state: Record<string, any>) => {
    const { t } = useTranslation(); 
    const translatedFeedOptions = feedOptions.map(({ value, text }) => ({
        value,
        text: t(text)
    }));
    
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
            options: translatedFeedOptions, 
            machineInputType: 'input',
            isValid: true,
        },
    ];
}

export {generalBookSettings};