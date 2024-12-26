import {useGoMakeSignalr} from "@/hooks/signalr/use-go-make-signalr";
import config from "@/config";
import {getUserToken} from "@/services/storage-data";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {isUpdateDialogsState} from "@/store/unread-messages-count";
import { quoteItemState } from "@/store/quote-item";

const useQuotesSignalr = ({getQuote}) => { 
   const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
    
    const {connection, closeConnection} = useGoMakeSignalr<any[]>({
        url: config.erp_server + '/hubs/quotes',
        accessToken: getUserToken(),
        methodName: ""
    })
    useEffect(() => {
      console.log("connection", connection)
        if (connection) {
            connection.on('UpdateQuoteItems', (newQuoteItem) => {
              getQuote()
              console.log("newQuoteItem", newQuoteItem)
              // setQuoteItemValue(prev => [...prev, newQuoteItem]);
            })
        }
    }, [connection])
    return {
        closeConnection
    }
}

export {useQuotesSignalr}