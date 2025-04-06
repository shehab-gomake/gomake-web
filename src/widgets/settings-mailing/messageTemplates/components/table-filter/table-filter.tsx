import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { filterInput } from "./inputs";
import { useStyle } from "./style";
import { useRecoilState, useRecoilValue } from "recoil";
import { SMSTemplateGroup } from "../../interfaces/interface";
import { allSMSTemplateGroupsState, templateGroupState } from "@/widgets/settings-mailing/states/state";
import { useEffect } from "react";
const TableFilter = () => {
  const { classes } = useStyle();
  const [templateGroup, setTemplateGroup] =
    useRecoilState<SMSTemplateGroup>(templateGroupState);
  const allSMSTemplateGroups = useRecoilValue<any>(allSMSTemplateGroupsState);

  const onChangeInputs = (key, value) => {
    setTemplateGroup({ ...templateGroup, [key]: value });
  };

  useEffect(() => {
    if (templateGroup === null) {
      setTemplateGroup({
        id: "00000000-0000-0000-0000-0000000000000",
        name: "Default",
      });
    }

  }, [templateGroup, allSMSTemplateGroups]);
  return (
    <Stack direction={"row"} style={classes.header}>
      {filterInput(templateGroup).map((item) => (
        <FormInput
          input={item as IInput}
          changeState={onChangeInputs}
          error={false}
          readonly={false}
        />
      ))}
    </Stack>
  );
};

export { TableFilter };
