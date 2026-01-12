import { ProfileAvatar } from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
import { GoMakeModal } from "@/components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Stack from "@mui/material/Stack";
import { IInput } from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import { personalInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/personal-inputs";
import { contactsInputs } from "@/widgets/settings-profile-widget/components/profiles/inputs/contacts-inputs";
import Button from "@mui/material/Button";
import { SecondaryButton } from "@/components/button/secondary-button";
import { FormInput } from "@/components/form-inputs/form-input";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { useRecoilState } from "recoil";
import { userProfileState } from "@/store/user-profile";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ChangePasswordComponent } from "@/components/change-password/change-password-component";

const UserProfile = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [state, setState] = useRecoilState(userProfileState);
  const { updateProfile, changeUserProfileImage, updateUserPassword } =
    useUserProfile();
  const changeState = (key, value) => {
    setState({ ...state, [key]: value });
  };
  const { t } = useTranslation();
  const formSections = [
    { inputs: personalInputs(state), title: "profileSettings.personal" },
    { inputs: contactsInputs(state), title: "profileSettings.contacts" },
  ];
  return (
    <div style={{ paddingBottom: 2 }}>
      <ProfileAvatar
        changeInitials={true}
        bgColor={state.avatarBackGroundColor}
        initials={state.avatarInitials}
        onUploadImage={changeUserProfileImage}
        src={state.imagePath}
        title={`${state.firstName} ${state.lastName}`}
      />
      <Stack direction={"column"} gap={"32px"} paddingTop={"44px"}>
        {formSections.map((section) => {
          return (
            <FormInputsSectionComponent sectionTitle={section.title}>
              {section.inputs.map((profileInput) => (
                <FormInput
                  key={profileInput.parameterKey}
                  input={profileInput as IInput & { readonly: boolean }}
                  changeState={changeState}
                  readonly={profileInput?.readonly}
                  error={false}
                />
              ))}
            </FormInputsSectionComponent>
          );
        })}
        <Stack direction={"row"} gap={"12px"}>
          <SecondaryButton
            onClick={() => setOpenModal(true)}
            variant={"outlined"}
            style={{ width: "fit-content" }}
          >
            {t("profileSettings.changePass")}
          </SecondaryButton>
          <SecondaryButton onClick={updateProfile} variant={"contained"}>
            {t("navigationButtons.update")}
          </SecondaryButton>
        </Stack>
      </Stack>
      <GoMakeModal
        insideStyle={{
          paddingLeft: 0,
          paddingRight: 0,
          height: "fit-content",
          width: 380,
        }}
        headerPadding={20}
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        modalTitle={t("profileSettings.changePassword")}
      >
        <ChangePasswordComponent onChangePassword={updateUserPassword} />
      </GoMakeModal>
    </div>
  );
};
export { UserProfile };
