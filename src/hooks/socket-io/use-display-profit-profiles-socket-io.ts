import {getUserToken} from "@/services/storage-data";
import config from "@/config";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";
import io from "socket.io-client";

const useDisplayProfitProfilesSocketIo = ({setProducts}) => {
    const profile = useRecoilValue(printHouseProfile);
    useEffect(() => {
        const socket = io(config.api_server);

        socket.on(`UpdateProfitProfileProduct-${profile.id}`, (updatedData) => {
            setProducts((prevProducts) => {
                const updatedProducts = prevProducts?.data?.map((product) => {
                    const matchingData = updatedData.find((data) => data.rowId === product.rowId);
                    if (matchingData) {
                        return {
                            ...product,
                            pricePerQuantity: matchingData.pricePerQuantity,
                        };
                    }
                    return product;
                });

                const updatedHeaders = prevProducts?.headers?.map((header) => {
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

        return () => {
            socket.disconnect();
        };
    }, []);

    return {
    };
};
export {useDisplayProfitProfilesSocketIo}

