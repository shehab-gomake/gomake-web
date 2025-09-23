import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useFileServiceStatusSocketIo } from "@/hooks/socket-io/use-file-service-status-socket-io";
import { EFileType, EFileInternalStructure, EFileDeliveryMode } from "./enums";
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
    hotFolders: [],
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

  const handleHotfolderChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      hotFolders: value,
    }));
  };

  const fetchFileServiceConfigs = async () => {
    const callBack = (res) => {
      if (res.success && res.data) {
        // Convert integer enum values back to strings for form inputs
        const processedHotFolders = (res.data.hotFolders || []).map(
          (hotfolder: any) => ({
            ...hotfolder,
            fileType: Array.isArray(hotfolder.fileType)
              ? hotfolder.fileType.map((type: number) => type.toString())
              : hotfolder.fileType?.toString() || [],
            fileInternalStructure:
              hotfolder.fileInternalStructure?.toString() || "",
            fileDeliveryMode:
              hotfolder.fileDeliveryMode?.toString() ||
              EFileDeliveryMode.ALWAYS_SEND.toString(),
          })
        );

        setFormData({
          hotFolders: processedHotFolders,
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
      // Parse enum values to integers for API
      const processedHotFolders = formData.hotFolders.map((hotfolder: any) => ({
        ...hotfolder,
        fileType: Array.isArray(hotfolder.fileType)
          ? hotfolder.fileType.map((type: string) => parseInt(type))
          : parseInt(hotfolder.fileType),
        fileInternalStructure: parseInt(hotfolder.fileInternalStructure),
        fileDeliveryMode: parseInt(hotfolder.fileDeliveryMode),
      }));

      const apiData = {
        hotFolders: processedHotFolders,
        fileServiceStatus: fileServiceStatus,
        isConfigured: isConfigured,
        authorizationKey: authorizationKey,
      };
      await submitFilesApiSettings(callApi, callBack, processedHotFolders);
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

  // Hotfolder inputs for FormArrayInput
  const hotfolderInputs: IInput[] = [
    {
      name: "hotFolderName",
      label: "fileApiSettings.hotfolderName",
      type: "text",
      placeholder: "fileApiSettings.hotfolderNamePlaceholder",
      required: true,
      parameterKey: "hotFolderName",
      options: [],
      value: "",
      isValid: true,
    },
    {
      name: "fileType",
      label: "fileApiSettings.fileType",
      type: "select",
      placeholder: "fileApiSettings.fileTypePlaceholder",
      required: true,
      parameterKey: "fileType",
      options: [
        { value: EFileType.ORIGINAL.toString(), text: "Original Files" },
        { value: EFileType.PRINT.toString(), text: "Print Files" },
        { value: EFileType.GOMAKE_JDF.toString(), text: "GoMake JDF" },
        {
          value: EFileType.ULTIMATE_IMPOSTRIP.toString(),
          text: "Ultimate Impostrip XML",
        },
        { value: EFileType.FREEFLOW.toString(), text: "FreeFlow XML" },
      ],
      value: "",
      isValid: true,
      multiple: true, // Make it multi-select
    },

    {
      name: "folderPath",
      label: "fileApiSettings.folderPath",
      type: "text",
      placeholder: "fileApiSettings.folderPathPlaceholder",
      required: true,
      parameterKey: "folderPath",
      options: [],
      value: "",
      isValid: true,
      note: "fileApiSettings.folderPathNote",
    },
    {
      name: "fileInternalStructure",
      label: "fileApiSettings.fileInternalStructure",
      type: "select",
      placeholder: "fileApiSettings.fileInternalStructurePlaceholder",
      required: true,
      parameterKey: "fileInternalStructure",
      options: [
        {
          value: EFileInternalStructure.HOTFOLDER_FILES.toString(),
          text: "HotFolder:// Files",
        },
        {
          value: EFileInternalStructure.HOTFOLDER_CUSTOMER_FILES.toString(),
          text: "HotFolder:// Customer Name / Files",
        },
        {
          value: EFileInternalStructure.HOTFOLDER_CUSTOMER_JOB_FILES.toString(),
          text: "HotFolder:// Customer Name / Job Number / Files",
        },
        {
          value:
            EFileInternalStructure.HOTFOLDER_CUSTOMER_ORDER_JOB_FILES.toString(),
          text: "HotFolder:// Customer Name / Order Number / Job Number / Files",
        },
        {
          value: EFileInternalStructure.HOTFOLDER_JOB_FILES.toString(),
          text: "HotFolder:// Job Number / Files",
        },
        {
          value: EFileInternalStructure.HOTFOLDER_ORDER_JOB_FILES.toString(),
          text: "HotFolder:// Order Number / Job Number / Files",
        },
      ],
      value: "",
      isValid: true,
      note: "fileApiSettings.fileInternalStructureNote",
    },
    {
      name: "remoteName",
      label: "fileApiSettings.hotfolderRemoteName",
      type: "text",
      placeholder: "fileApiSettings.hotfolderRemoteNamePlaceholder",
      required: true,
      parameterKey: "remoteName",
      options: [],
      value: "",
      isValid: true,
      // note: "fileApiSettings.hotfolderRemoteNameNote",
    },
    {
      name: "username",
      label: "fileApiSettings.hotfolderUsername",
      type: "text",
      placeholder: "fileApiSettings.hotfolderUsernamePlaceholder",
      required: false,
      parameterKey: "username",
      options: [],
      value: "",
      isValid: true,
      note: "fileApiSettings.hotfolderUsernameNote",
    },
    {
      name: "password",
      label: "fileApiSettings.hotfolderPassword",
      type: "password",
      placeholder: "fileApiSettings.hotfolderPasswordPlaceholder",
      required: false,
      parameterKey: "password",
      options: [],
      value: "",
      isValid: true,
      note: "fileApiSettings.hotfolderPasswordNote",
    },
    {
      name: "fileDeliveryMode",
      label: "fileApiSettings.fileDeliveryMode",
      type: "select",
      placeholder: "fileApiSettings.fileDeliveryModePlaceholder",
      required: true,
      parameterKey: "fileDeliveryMode",
      options: [
        {
          value: EFileDeliveryMode.ALWAYS_SEND.toString(),
          text: "Always Send",
        },
        {
          value: EFileDeliveryMode.RULE_BASED_SEND.toString(),
          text: "Rule-Based Send",
        },
      ],
      value: EFileDeliveryMode.ALWAYS_SEND.toString(),
      isValid: true,
      note: "fileApiSettings.fileDeliveryModeNote",
    },
  ];

  return {
    formData,
    loading,
    isConfigured,
    fileServiceStatus,
    authorizationKey,
    isCopied,
    hotfolderInputs,
    handleHotfolderChange,
    handleSubmitAndDownload,
    handleDownloadInstaller,
    handleCopyAuthorizationKey,
    fetchFileServiceConfigs,
    t,
  };
};
