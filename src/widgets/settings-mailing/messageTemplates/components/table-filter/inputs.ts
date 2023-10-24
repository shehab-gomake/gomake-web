import { allSMSTemplateGroupsState } from "@/widgets/settings-mailing/states/state";
import { useRecoilState } from "recoil";

const filterInput = (state: any) => {
    const [allSMSTemplateGroups, setAllSMSTemplateGroups] = useRecoilState<any>(allSMSTemplateGroupsState);
    
    return [
        {
            name: "SMSgroup",
            label: "mailingSettings.group",
            type: "select",
            placeholder: "mailingSettings.group",
            required: false,
            parameterKey: "groupName",
            value: state?.groupName,
          //  optionsUrl: "/v1/communication-service/sms-templates-groups/get-all-smsTemplates-groups",
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