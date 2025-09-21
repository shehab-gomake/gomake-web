import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useFileServiceStatusSocketIo } from "@/hooks/socket-io/use-file-service-status-socket-io";
import { FoldersCreationTypes } from "@/enums";
import { IInput } from "@/components/form-inputs/interfaces";
import {
  submitFilesApiSettings,
  getFileServiceConfigs,
} from "@/services/api-service/files-api-settings/files-api-settings-endpoint";

export const useFileApiSettings = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFault, alertFaultUpdate } = useSnackBar();
  const {
    fileServiceStatus: socketFileServiceStatus,
    setFileServiceStatus: setSocketFileServiceStatus,
  } = useFileServiceStatusSocketIo();

  const [formData, setFormData] = useState({
    remoteName: "",
    computerName: "",
    username: "",
    password: "",
    baseDir: "",
    workFlowDir: "",
    workFlowRemoteName: "",
    workFlowUsername: "",
    workFlowPassword: "",
    foldersCreationType: FoldersCreationTypes.Default.toString(),
  });

  const [isConfigured, setIsConfigured] = useState(false);
  const [fileServiceStatus, setFileServiceStatus] = useState(0); // 0: Inactive, 1: Active, 2: Error
  const [loading, setLoading] = useState(false);
  const [authorizationKey, setAuthorizationKey] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Update local state when socket status changes
  useEffect(() => {
    if (socketFileServiceStatus !== fileServiceStatus) {
      setFileServiceStatus(socketFileServiceStatus);
    }
  }, [socketFileServiceStatus]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchFileServiceConfigs = async () => {
    const callBack = (res) => {
      if (res.success && res.data) {
        setFormData({
          remoteName: res.data.remoteName || "",
          computerName: res.data.computerName || "",
          username: res.data.username || "",
          password: res.data.password || "",
          baseDir: res.data.baseDir || "",
          workFlowDir: res.data.workFlowDir || "",
          workFlowRemoteName: res.data.workFlowRemoteName || "",
          workFlowUsername: res.data.workFlowUsername || "",
          workFlowPassword: res.data.workFlowPassword || "",
          foldersCreationType:
            res.data.foldersCreationType?.toString() ||
            FoldersCreationTypes.Default.toString(),
        });
        setIsConfigured(res.data.isConfigured || false);
        const newStatus = res.data.fileServiceStatus || 0;
        setFileServiceStatus(newStatus);
        setSocketFileServiceStatus(newStatus); // Sync with socket state
        setAuthorizationKey(res.data.authorizationKey || "");
      }
    };
    await getFileServiceConfigs(callApi, callBack);
  };

  const handleSubmitAndDownload = async () => {
    setLoading(true);
    const callBack = async (res) => {
      if (res.success) {
        // Only download if not already configured
        if (!isConfigured) {
          handleDownloadInstaller();
        }
        // Fetch updated configs to get the AuthorizationKey
        await fetchFileServiceConfigs();
      } else {
        alertFaultUpdate();
      }
      setLoading(false);
    };
    try {
      const apiData = {
        ...formData,
        foldersCreationType: parseInt(formData.foldersCreationType),
      };
      await submitFilesApiSettings(callApi, callBack, apiData);
    } catch (error) {
      console.error("Error submitting file API settings:", error);
      alertFault("Failed to save and download file API settings");
      setLoading(false);
    }
  };

  const handleDownloadInstaller = () => {
    window.open(
      "https://gomakefileserviceinstaller.s3.eu-central-1.amazonaws.com/GoMakeServiceInstaller.zip",
      "_blank"
    );
  };

  const handleCopyAuthorizationKey = async () => {
    try {
      await navigator.clipboard.writeText(authorizationKey);
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy authorization key:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = authorizationKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const formInputs: IInput[] = [
    {
      name: "remoteName",
      label: "fileApiSettings.remoteName",
      type: "text",
      placeholder: "fileApiSettings.remoteNamePlaceholder",
      required: true,
      parameterKey: "remoteName",
      options: [],
      value: formData.remoteName,
      isValid: true,
      note: "",
    },
    {
      name: "computerName",
      label: "fileApiSettings.computerName",
      type: "text",
      placeholder: "fileApiSettings.computerNamePlaceholder",
      required: true,
      parameterKey: "computerName",
      options: [],
      value: formData.computerName,
      isValid: true,
      note: "",
    },
    {
      name: "username",
      label: "fileApiSettings.username",
      type: "text",
      placeholder: "fileApiSettings.usernamePlaceholder",
      required: true,
      parameterKey: "username",
      options: [],
      value: formData.username,
      isValid: true,
    },
    {
      name: "password",
      label: "fileApiSettings.password",
      type: "password",
      placeholder: "fileApiSettings.passwordPlaceholder",
      required: true,
      parameterKey: "password",
      options: [],
      value: formData.password,
      isValid: true,
    },
    {
      name: "baseDir",
      label: "fileApiSettings.baseDir",
      type: "text",
      placeholder: "fileApiSettings.baseDirPlaceholder",
      required: true,
      parameterKey: "baseDir",
      options: [],
      value: formData.baseDir,
      isValid: true,
      note: "",
    },
    {
      name: "workFlowDir",
      label: "fileApiSettings.workFlowDir",
      type: "text",
      placeholder: "fileApiSettings.workFlowDirPlaceholder",
      required: true,
      parameterKey: "workFlowDir",
      options: [],
      value: formData.workFlowDir,
      isValid: true,
      note: "",
    },
    {
      name: "workFlowRemoteName",
      label: "fileApiSettings.workFlowRemoteName",
      type: "text",
      placeholder: "fileApiSettings.workFlowRemoteNamePlaceholder",
      required: true,
      parameterKey: "workFlowRemoteName",
      options: [],
      value: formData.workFlowRemoteName,
      isValid: true,
      note: "",
    },
    {
      name: "workFlowUsername",
      label: "fileApiSettings.workFlowUsername",
      type: "text",
      placeholder: "fileApiSettings.workFlowUsernamePlaceholder",
      required: true,
      parameterKey: "workFlowUsername",
      options: [],
      value: formData.workFlowUsername,
      isValid: true,
      note: "",
    },
    {
      name: "workFlowPassword",
      label: "fileApiSettings.workFlowPassword",
      type: "password",
      placeholder: "fileApiSettings.workFlowPasswordPlaceholder",
      required: true,
      parameterKey: "workFlowPassword",
      options: [],
      value: formData.workFlowPassword,
      isValid: true,
      note: "",
    },
    {
      name: "foldersCreationType",
      label: "fileApiSettings.foldersCreationType",
      type: "select",
      placeholder: "fileApiSettings.foldersCreationTypePlaceholder",
      required: true,
      parameterKey: "foldersCreationType",
      options: [
        {
          value: FoldersCreationTypes.Default.toString(),
          text: t("fileApiSettings.foldersCreationTypeOptions.default"),
        },
        {
          value:
            FoldersCreationTypes.OrderNumberAndMissionNumberOnly.toString(),
          text: t(
            "fileApiSettings.foldersCreationTypeOptions.orderNumberAndMissionNumberOnly"
          ),
        },
        {
          value: FoldersCreationTypes.MissionFolderInsideOrderFolder.toString(),
          text: t(
            "fileApiSettings.foldersCreationTypeOptions.missionFolderInsideOrderFolder"
          ),
        },
        {
          value:
            FoldersCreationTypes.DefaultButWithArrangedOrdersFolder.toString(),
          text: t(
            "fileApiSettings.foldersCreationTypeOptions.defaultButWithArrangedOrdersFolder"
          ),
        },
      ],
      value: formData.foldersCreationType,
      isValid: true,
      dropdownStyle: {
        width: "100%",
        minWidth: "fit-content",
      },
    },
  ];

  return {
    formData,
    loading,
    isConfigured,
    fileServiceStatus,
    authorizationKey,
    isCopied,
    formInputs,
    handleInputChange,
    handleSubmitAndDownload,
    handleDownloadInstaller,
    handleCopyAuthorizationKey,
    fetchFileServiceConfigs,
    t,
  };
};
