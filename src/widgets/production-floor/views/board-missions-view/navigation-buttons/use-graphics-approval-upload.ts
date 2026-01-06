import { useState, useEffect } from "react";
import { useGomakeAxios } from "@/hooks";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { useRecoilState } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { getTempUserToken, getUserToken } from "@/services/storage-data";
import axios from "axios";
import { uploadFileResumable } from "@/utils/resumable-upload";
import {
  getAllBoardMissionsUploadedFiles,
  deleteJobFileApi,
  sendGraphicsApprovalToClientApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { FileTypeENUM } from "@/widgets/file-uploader-widget/interface";

interface UploadedFile {
  fileName: string;
  url: string;
  bucketKey: string;
}

const useGraphicsApprovalUpload = ({
  boardMissionId,
  orderItemId,
  productType,
  openModal,
}) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [companyProfile] = useRecoilState(printHouseProfile);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [downloadingFiles, setDownloadingFiles] = useState<string[]>([]);
  const [deletingFiles, setDeletingFiles] = useState<string[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Load existing files when modal opens
  useEffect(() => {
    if (openModal && orderItemId) {
      loadExistingFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, orderItemId, productType]);

  const loadExistingFiles = async () => {
    const callBack = (res) => {
      if (res?.success && res?.data) {
        // Filter only Graphics files
        const graphicsFiles = res.data
          .filter((file) => file.fileType === FileTypeENUM.Graphics)
          .map((file) => ({
            fileName: file.fileName,
            url: file.filePath,
            bucketKey: file.bucketKey || "",
          }));
        setUploadedFiles(graphicsFiles);
      }
    };

    await getAllBoardMissionsUploadedFiles(
      callApi,
      callBack,
      {
        orderItemId: orderItemId,
        productType: productType,
      },
      false,
      null
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Add file to uploading state
    setUploadingFiles((prev) => [...prev, file]);

    try {
      let userToken = getUserToken();
      if (!userToken) {
        userToken = getTempUserToken();
      }

      // Step 1: Request upload session from gomake-cloud-files-api
      const response = await axios.post(
        `${companyProfile.filesApiAddress}/api/Files/CreateUploadSession`,
        { 
          fileName: file.name, 
          contentType: file.type,
          bucketName: "gomake-graphics-approval",
          isDev: true,
          origin: "http://localhost:3004",
        },
        {
          headers: {
            authorization: "Bearer " + userToken,
          },
        }
      );

      const { sessionUri, bucketName, fileUrl } = response.data;

      // Step 2: Upload file to GCS using resumable upload
      const uploadResult = await uploadFileResumable({
        sessionUri,
        file,
        onProgress: (progress) => {
          // Progress tracking can be added here if needed
        },
        chunkSize: 8 * 1024 * 1024, // 8 MiB chunks
      });

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      // Step 3: Update local state with uploaded file (no API call to save-uploaded-file)
      // Remove file from uploading state
      setUploadingFiles((prev) => prev.filter((f) => f !== file));
      // Add to uploaded files
      setUploadedFiles((prev) => [
        ...prev,
        {
          fileName: file.name,
          url: fileUrl,
          bucketKey: bucketName,
        },
      ]);
      alertSuccessUpdate();
    } catch (error) {
      console.error("File upload error:", error);
      // Remove file from uploading state on error
      setUploadingFiles((prev) => prev.filter((f) => f !== file));
      alertFaultGetData();
    }
  };

  const handleDownloadFile = async (bucketKey: string) => {
    // Add file to downloading state
    setDownloadingFiles((prev) => [...prev, bucketKey]);

    try {
      let userToken = getUserToken();
      if (!userToken) {
        userToken = getTempUserToken();
      }

      const response = await axios.post(
        `${companyProfile.filesApiAddress}/api/Files/CreateDownloadFilePreSignedUrl`,
        { bucketKey: bucketKey },
        {
          headers: {
            authorization: "Bearer " + userToken,
          },
        }
      );

      if (response.data && typeof response.data === "string") {
        // Open the presigned URL in a new tab
        window.open(response.data, "_blank");
      } else {
        console.error("Invalid response from CreateDownloadFilePreSignedUrl");
      }
    } catch (error) {
      console.error("Error getting download URL:", error);
      alertFaultGetData();
    } finally {
      // Remove file from downloading state
      setDownloadingFiles((prev) => prev.filter((key) => key !== bucketKey));
    }
  };

  const handleDeleteFile = async (bucketKey: string, fileName: string, url: string) => {
    // Add file to deleting state
    setDeletingFiles((prev) => [...prev, bucketKey]);

    try {
      const callBack = (res) => {
        if (res?.success) {
          // Remove file from uploaded files
          setUploadedFiles((prev) =>
            prev.filter((f) => f.bucketKey !== bucketKey)
          );
          alertSuccessUpdate();
        } else {
          alertFaultUpdate();
        }
      };

      await deleteJobFileApi(callApi, callBack, {
        orderItemId: orderItemId,
        filename: fileName,
        source: url,
        productType: productType || "",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      alertFaultUpdate();
    } finally {
      // Remove file from deleting state
      setDeletingFiles((prev) => prev.filter((key) => key !== bucketKey));
    }
  };

  const handleSendGraphicsApproval = async (onSuccess?: () => void) => {
    if (uploadedFiles.length === 0) {
      alertFaultGetData();
      return;
    }

    if (uploadingFiles.length > 0) {
      alertFaultGetData();
      return;
    }

    setIsSending(true);

    try {
      const callBack = (res) => {
        setIsSending(false);
        if (res?.success) {
          alertSuccessUpdate();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          alertFaultUpdate();
        }
      };

      await sendGraphicsApprovalToClientApi(callApi, callBack, {
        boardMissionId: boardMissionId,
        fileUrls: uploadedFiles.map((file) => file.url),
      });
    } catch (error) {
      console.error("Error sending graphics approval:", error);
      setIsSending(false);
      alertFaultUpdate();
    }
  };

  return {
    handleFileUpload,
    uploadedFiles,
    uploadingFiles,
    handleDeleteFile,
    handleDownloadFile,
    handleSendGraphicsApproval,
    deletingFiles,
    downloadingFiles,
    isSending,
  };
};

export { useGraphicsApprovalUpload };

