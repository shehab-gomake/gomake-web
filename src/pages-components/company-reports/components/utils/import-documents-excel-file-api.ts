import axios from "axios";
import config from "@/config";
import { getUserToken } from "@/services/storage-data";

const importDocumentsApi = async (callBack, formData) => {
  try {
    const ERP_SERVER_URL = config.erp_server;
    const response = await axios.post(
      `${ERP_SERVER_URL}/api/Documents/ImportDocumentsExcelFile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + getUserToken(),
        },
      }
    );

    callBack({
      success: true,
      status: response?.status,
      data: response?.data,
    });
  } catch (error) {
    console.error("Error importing documents:", error);

    const status = error.response?.status || 500;
    const errorData = error.response?.data || null;

    callBack({
      success: false,
      status,
      error: errorData,
    });
  }
};

export default importDocumentsApi;
