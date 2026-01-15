import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { useStyle } from "./style";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import { emailRegex } from "@/utils/regex";
import { useGomakeAxios } from "@/hooks";
import { inviteEmployeeApi } from "@/services/api-service/users/users-api";
import { useSnackBar } from "@/hooks";
import { useRecoilValue } from "recoil";
import { languageOptionsState } from "@/store/languages";

interface InviteEmployeeModalProps {
  openModal: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface InviteFormData {
  firstname: string;
  lastname: string;
  email: string;
  roleID: string;
}

const InviteEmployeeModal = ({
  openModal,
  onClose,
  onSuccess,
}: InviteEmployeeModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded, alertFault } = useSnackBar();
  const languages = useRecoilValue(languageOptionsState);

  const [formData, setFormData] = useState<InviteFormData>({
    firstname: "",
    lastname: "",
    email: "",
    roleID: "",
  });

  const [loading, setLoading] = useState(false);

  const updateFormData = (key: keyof InviteFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isValid = () => {
    return (
      !!formData.firstname &&
      !!formData.lastname &&
      !!formData.email &&
      emailRegex.test(formData.email) &&
      !!formData.roleID
    );
  };

  const handleInvite = async () => {
    if (!isValid()) {
      alertFault("products.offsetPrice.admin.errorReq");
      return;
    }

    setLoading(true);
    const callback = (data: any) => {
      setLoading(false);
      if (data.success) {
        alertSuccessAdded();
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          roleID: "",
        });
        onSuccess();
        onClose();
      } else {
        if (data?.statusCode === 96) {
          alertFault("alerts.mailAlreadyExists");
        } else {
          alertFaultAdded();
        }
      }
    };

    await inviteEmployeeApi(callApi, callback, formData);
  };

  const inputs: IInput[] = [
    {
      name: "firstName",
      label: "usersSettings.firstName",
      type: "text",
      placeholder: "usersSettings.firstName",
      required: true,
      parameterKey: "firstname",
      options: [],
      value: formData.firstname,
      machineInputType: "input",
      isValid: !!formData.firstname,
      inputs: []
    },
    {
      name: "lastName",
      label: "usersSettings.lastName",
      type: "text",
      placeholder: "usersSettings.lastName",
      required: true,
      parameterKey: "lastname",
      options: [],
      value: formData.lastname,
      machineInputType: "input",
      isValid: !!formData.lastname,
      inputs: []
    },
    {
      name: "email",
      label: "usersSettings.email",
      type: "text",
      placeholder: "usersSettings.email",
      required: true,
      parameterKey: "email",
      options: [],
      value: formData.email,
      machineInputType: "input",
      isValid: !!formData.email && emailRegex.test(formData.email),
      regex: emailRegex,
      inputs: []
    },
    {
      name: "roleID",
      label: "usersSettings.roleID",
      type: "select",
      placeholder: "usersSettings.roleID",
      required: true,
      parameterKey: "roleID",
      value: formData.roleID,
      options: [],
      isValid: true,
      optionsUrl: "/v1/crm-service/roles/get-all-roles",
      inputs: []
    },
  ];

  return (
    <div style={classes.container}>
      <Stack spacing={2} sx={{ padding: "20px" }}>
        {inputs.map((input) => (
          <FormInput
            key={input.parameterKey}
            input={input}
            changeState={(key, value) =>
              updateFormData(key as keyof InviteFormData, value)
            }
            error={
              input.required && !formData[input.parameterKey as keyof InviteFormData]
            }
          />
        ))}
        <div style={classes.btnContainer}>
          <Button
            sx={classes.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            {t("modal.cancel")}
          </Button>
          <Button
            sx={classes.actionBtn}
            onClick={handleInvite}
            disabled={loading || !isValid()}
          >
            {loading ? t("modal.sending") : t("modal.send")}
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export { InviteEmployeeModal };
