import { allSMSTemplateGroupsState } from "@/widgets/settings-mailing/states/state";
import { useRecoilValue } from "recoil";

const filterInput = (state: any) => {
    const allSMSTemplateGroups = useRecoilValue<any>(allSMSTemplateGroupsState);
    return [
        {
            name: "SMSgroup",
            label: "mailingSettings.group",
            type: "select",
            placeholder: "mailingSettings.group",
            required: false,
            parameterKey: "id",
            value: state?.id,
            options: allSMSTemplateGroups
        }
    ];
}

const switchInputs = (state: any) => {
    return [
        {
            name: "",
            label: "mailingSettings.sendViaSms",
            type: "switch",
            placeholder: "mailingSettings.sendViaSms",
            required: false,
            parameterKey: "isSendViaSms",
            options: [],
            value: state?.isSendViaSms,
            isValid: true,
            direction: "row",
        },
        {
            name: "default",
            label: "mailingSettings.sendThroughTwilio",
            type: "switch",
            placeholder: "mailingSettings.sendThroughTwilio",
            required: false,
            parameterKey: "isSendThroughTwilio",
            options: [],
            value: state?.isSendThroughTwilio,
            isValid: true,
            direction: "row",
        }
    ];
}

export { filterInput, switchInputs };