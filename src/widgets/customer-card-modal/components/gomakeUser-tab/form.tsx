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
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";

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
  const languagesOptions = useRecoilValue(languageOptionsState);
  const profileData = useRecoilValue<ICompanyProfile>(companyProfileState);
  const defaultLanguageOptions = profileData?.languages?.length > 0
    ? languagesOptions.filter((lang) => profileData?.languages?.includes(lang.value))
    : [];
  const { callApi } = useGomakeAxios();
  const [rolesOptions, setRolesOptions] = useState<
    { value: string; text: string; isClientRole?: boolean }[]
  >([]);

  const { classes } = useStyle();
  const { t } = useTranslation();

  const showPassFiled = user.id ? true : false;

  // Fetch roles once on mount
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
        }
      };
      await getAllRolesForDropdownApi(callApi, callBack);
    };
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set default role when roles are loaded and user doesn't have a roleId
  useEffect(() => {
    if (rolesOptions.length > 0 && !user.roleId) {
      const defaultRole = rolesOptions.find(
        (role) => role.isClientRole === true
      );
      if (defaultRole) {
        setUser({
          ...user,
          roleId: defaultRole.value,
        });
      }
    }
  }, [rolesOptions, user, setUser]);

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
        {userInputs(user, showPassFiled, defaultLanguageOptions, rolesOptions).map(
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
