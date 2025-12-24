import * as React from "react";
import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { userInputs } from "../../inputs/user-inputs";
import { Button, Stack } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { gomakeUserState } from "./gomakeUserState";
import { resetPassModalState } from "../../state";
import { languageOptionsState, languagesState } from "@/store/languages";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAllRolesForDropdownApi } from "@/services/api-service/users/roles-api";

interface IProps {
  user: {
    id?: string;
    username?: string;
    password?: string;
    email?: string;
    userIPAddress?: string;
    isCanLoginWithCode?: boolean;
    roleId?: string;
    index?: number;
  };
  onDelete: (value: number) => void;
  setUser: any;
}

const UserForm = ({ user, onDelete, setUser }: IProps) => {
  const setOpenModal = useSetRecoilState<boolean>(resetPassModalState);
  const setGomakeUser = useSetRecoilState<{}>(gomakeUserState);
  // const languagesOptions = useRecoilValue(languagesState);
  const languagesOptions = useRecoilValue(languageOptionsState);
  const { callApi } = useGomakeAxios();
  const [rolesOptions, setRolesOptions] = useState<
    { value: string; text: string; isClientRole?: boolean }[]
  >([]);

  const { classes } = useStyle();
  const { t } = useTranslation();

  const showPassFiled = user.id ? true : false;

  useEffect(() => {
    const fetchRoles = async () => {
      const callBack = (res) => {
        if (res?.success) {
          const roles = res?.data?.map(
            (item: {
              value: string;
              text: string;
              isClientRole?: boolean;
            }) => ({
              value: item.value,
              text: item.text,
              isClientRole: item.isClientRole,
            })
          );
          setRolesOptions(roles);

          // Set default role if user doesn't have one and there's a role with isClientRole = true
          if (!user.roleId && roles.length > 0) {
            const defaultRole = roles.find(
              (role) => role.isClientRole === true
            );
            if (defaultRole) {
              setUser((prevUser) => ({
                ...prevUser,
                roleId: defaultRole.value,
              }));
            }
          }
        }
      };
      await getAllRolesForDropdownApi(callApi, callBack);
    };
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {userInputs(user, showPassFiled, languagesOptions, rolesOptions).map(
          (item) => (
            <FormInput
              input={item as IInput}
              changeState={onChangeInputs}
              error={item.required && !item.value}
              readonly={false}
            />
          )
        )}

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

      <Stack direction={"row"} marginTop={"20px"} marginBottom={"15px"}>
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
