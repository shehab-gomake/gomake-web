import { getInitialOrderFoldersData } from "@/services/api-service/board-missions/board-missions-table";
import { getUserToken } from "@/services/storage-data";
import axios from "axios";

export const createOrderFolders = async (
  callApi: any,
  orderId: string,
  companyProfile: any
): Promise<void> => {
  if (!companyProfile?.filesApiAddress || !orderId) {
    return;
  }

  try {
    const callBack = (res: any) => {
      if (res?.data) {
        const url =
          companyProfile.filesApiAddress + "/api/Files/CreateOrderFolder";
        axios
          .post(url, res.data, {
            headers: {
              authorization: "Bearer " + getUserToken(),
            },
          })
          .then(() => {
            console.log("Order folders created successfully");
          })
          .catch((error) => {
            console.error("Error creating order folders:", error);
          });
      }
    };

    await getInitialOrderFoldersData(callApi, callBack, {
      orderId: orderId,
    });
  } catch (error) {
    console.error("Error in createOrderFolders:", error);
  }
};
