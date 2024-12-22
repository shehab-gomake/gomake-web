import { useGoMakeSignalr } from "@/hooks/signalr/use-go-make-signalr";
import { getUserToken } from "@/services/storage-data";
import config from "@/config";
import { useEffect } from "react";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const useDocumentsSignalR = ({ getAllQuotes, docType }) => {
  //   const { connection } = useGoMakeSignalr<any[]>({
  //     url: config.erp_server + "hubs/orders",
  //     accessToken: getUserToken(),
  //     methodName: "",
  //   });

  //   useEffect(() => {
  //     debugger;
  //     if (connection) {
  //       connection.on("displayOrders", () => {
  //         getAllQuotes();
  //       });
  //     }
  //   }, [connection]);

  //   return {};
  // };

  const docTypeConfig = {
    [DOCUMENT_TYPE.order]: { hub: "hubs/orders", methodName: "displayOrders" },
    [DOCUMENT_TYPE.invoice]: {
      hub: "hubs/invoices",
      methodName: "displayInvoices",
    },
    [DOCUMENT_TYPE.deliveryNote]: {
      hub: "hubs/deliveryNotes",
      methodName: "displayDeliveryNotes",
    },
  };

  const selectedDocConfig = docTypeConfig[docType];

  const { connection } = useGoMakeSignalr<any[]>({
    url: config.erp_server + selectedDocConfig?.hub,
    accessToken: getUserToken(),
    methodName: "",
  });

  useEffect(() => {
    if (connection && selectedDocConfig?.methodName) {
      connection.on(selectedDocConfig.methodName, () => {
        getAllQuotes();
      });
    }

    return () => {
      if (connection && selectedDocConfig?.methodName) {
        connection.off(selectedDocConfig.methodName);
      }
    };
  }, [connection, selectedDocConfig?.methodName]);

  return {};
};

export { useDocumentsSignalR };
