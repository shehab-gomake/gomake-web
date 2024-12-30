import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import config from "@/config";
import {getUserToken} from "@/services/storage-data";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import { quoteItemState } from "@/store/quote-item";

const useOrdersSignalr = ({getQuote}) => {
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
    const {connection, closeConnection} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/orders',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
        if (connection) {
            connection.on('UpdateOrderItems', (newOrderItem) => {
              console.log("newOrderItem", newOrderItem)
              getQuote()
              // setQuoteItemValue(prev => [...prev, newQuoteItem]);
            })
        }
    }, [connection])
    return {
        closeConnection
    }
}

export {useOrdersSignalr}