import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { groupNameInput } from "./inputs";
import { useRecoilState } from "recoil";
import { templateGroupStateNew } from "@/widgets/settings-mailing/states/state";
import { SMSTemplateGroup } from "../../interfaces/interface";

export enum ActionType {
  EDIT = "edit",
  ADD = "add",
}
interface IProps {
  actionType: ActionType;
  state?: any;
  setState?: any;
}

const AddNewSMSTemplateGroup = ({ actionType, state, setState }: IProps) => {
  const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(
    templateGroupStateNew
  );
  const isAddAction = actionType === ActionType.ADD;

  const onChangeInputs = (key, value) => {
    if (isAddAction) setTemplateGroup({ ...templateGroup, [key]: value });
    else setState({ ...state, [key]: value });
  };

  return (
    <Stack direction={"row"}>
      {groupNameInput(isAddAction ? templateGroup : state).map((item) => (
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

export { AddNewSMSTemplateGroup };
