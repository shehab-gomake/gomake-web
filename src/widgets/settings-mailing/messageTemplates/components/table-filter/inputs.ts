import { allSMSTemplateGroupsState } from "@/widgets/settings-mailing/states/state";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

const filterInput = (state: any) => {
  const { t } = useTranslation();
  const allSMSTemplateGroups = useRecoilValue<any>(allSMSTemplateGroupsState);
  return [
    {
      name: "SMSgroup",
      label: "mailingSettings.group",
      type: "select",
      placeholder: "mailingSettings.group",
      required: false,
      parameterKey: "id",
      value: state?.id  ,
      options: [
        { text: t("customers.modal.default"), value: "00000000-0000-0000-0000-0000000000000" }, // Static option
        ...allSMSTemplateGroups.map((group) => ({
            text: group.name,
            value: group.id,
        }))
    ],
    },
  ];
};

export { filterInput };
