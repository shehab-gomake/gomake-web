import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useEffect} from "react";

const useDisplayProfitProfilesSignalr = ({setProducts}) => {
    const {connection,} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/displayProfitProfiles',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            connection.on("UpdateProfitProfileProduct", (updatedData) => {
              setProducts((prevProducts) => {
                const updatedProducts = prevProducts.data.map((product) => {
                  const matchingData = updatedData.find((data) => data.rowId === product.rowId);
                  if (matchingData) {
                    return {
                      ...product,
                      pricePerQuantity: matchingData.pricePerQuantity,
                    };
                  }
                  return product;
                });
              
                const updatedHeaders = prevProducts.headers.map((header) => {
                  const totalForQuantity = updatedProducts
                    .filter((product) => product.isSelected) // Include only selected products
                    .reduce((sum, product) => {
                      const price = product.pricePerQuantity.find(
                        (p) => p.quantity === header.quantity
                      );
                      return sum + (price?.calculatedPrice || 0);
                    }, 0);
              
                  return {
                    ...header,
                    total: totalForQuantity,
                  };
                });
              
                return {
                  ...prevProducts,
                  data: updatedProducts,
                  headers: updatedHeaders,
                };
              });
            });
        }
    }, [connection]);
    return {}
};
export {useDisplayProfitProfilesSignalr}

