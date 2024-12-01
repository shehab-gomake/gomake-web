import { useTranslation } from "react-i18next";
import { GomakeTextInput } from "@/components";
import { SecondaryButton } from "@/components/button/secondary-button";
import { EActions } from "@/widgets/settings-users/Permissions/enum/actions";
import Stack from "@mui/material/Stack";
import { PrimaryButton } from "@/components/button/primary-button";

interface IAddUpdateRoleProps {
  onChange?: (v: string) => void;
  value?: string;
  onActionClick: () => void;
  action: EActions;
  onClose?: () => void;
}
const AddUpdateRole = ({
  onChange,
  value,
  onActionClick,
  action,
  onClose,
}: IAddUpdateRoleProps) => {
  const { t } = useTranslation();
  return (
    <Stack padding={2} direction={"column"} gap={2}>
      {action !== EActions.DELETE && (
        <Stack width={"80%"}>
          <GomakeTextInput
            value={value}
            placeholder={t("permissionsSettings.Role name")}
            onChange={(e: any) => {
              onChange(e.target.value);
            }}
          />
        </Stack>
      )}
      {action === EActions.DELETE ? (
        <Stack
          direction={"row"}
          gap={2}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"flex-end"}
          alignSelf={"center"}
          paddingTop={"40px"}
        >
          <PrimaryButton onClick={onActionClick} variant={"contained"}>
            {t("navigationButtons.delete")}
          </PrimaryButton>
          <PrimaryButton onClick={onClose} variant={"outlined"}>
            {t("modal.cancel")}
          </PrimaryButton>
        </Stack>
      ) : (
        <Stack direction={"row"} justifyContent={"flex-end"}>
          <SecondaryButton onClick={onActionClick} variant={"contained"}>
            {t(
              action === EActions.ADD
                ? "permissionsSettings.add"
                : "permissionsSettings.update"
            )}
          </SecondaryButton>
        </Stack>
      )}
    </Stack>
  );
};
export { AddUpdateRole };
