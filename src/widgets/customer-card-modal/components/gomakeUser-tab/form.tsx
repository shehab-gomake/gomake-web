import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { userInputs } from "../../inputs/user-inputs";
import { Button, Stack } from "@mui/material";
import { useRecoilState } from "recoil";
import { gomakeUserState } from "./gomakeUserState";
import { resetPassModalState } from "../../state";

interface IProps {
  user: {
    id?: string;
    username?: string;
    password?: string;
    email?: string;
    userIPAddress?: string;
    isCanLoginWithCode?: boolean;
    index?: number;
  };
  onDelete: (value: number) => void;
  setUser: any;
}

const UserForm = ({ user, onDelete, setUser }: IProps) => {
  const [openModal, setOpenModal] =
    useRecoilState<boolean>(resetPassModalState);
  const [gomakeUser, setGomakeUser] = useRecoilState<{}>(gomakeUserState);
  const { classes } = useStyle();
  const { t } = useTranslation();

  const showPassFiled = user.id ? true : false;

  const onChangeInputs = (key, value) => {
    if (key == "email") {
      setUser({ ...user, email: value, username: value });
    } else {
      setUser({ ...user, [key]: value });
    }
  };

  return (
    <div>
      <div style={classes.customerInfoStyle}>
        {userInputs(user, showPassFiled).map((item) => (
          <FormInput
            input={item as IInput}
            changeState={onChangeInputs}
            error={item.required && !item.value}
            readonly={false}
          />
        ))}

        {showPassFiled && (
          <Stack direction={"column"} gap={"10px"} width={"180px"}>
            <span style={classes.inputLbl}>
              {t("customers.modal.password")}
            </span>
            <Button
              onClick={() => {
                setGomakeUser(user);
                setOpenModal(true);
              }}
              variant={"contained"}
            >
              {t("customers.buttons.changePass")}
            </Button>
          </Stack>
        )}
      </div>

      <Stack direction={"row"} marginTop={"20px"}>
        <a style={classes.removeFormStyle} onClick={() => onDelete(user.index)}>
          <RemoveIcon />
          <button style={classes.buttonsStyle}>
            {t("customers.buttons.remove")}
          </button>
        </a>
      </Stack>
    </div>
  );
};

export { UserForm };
