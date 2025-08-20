import {useEffect} from "react";
import io from "socket.io-client";
import config from "@/config";
import { useRecoilValue } from "recoil";
import { userState } from "@/store";
import { getIfCartExistApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "../use-gomake-axios";
import { useRouter } from "next/router";

const updateQuoteStatusSocketIo = ({ setUserQuote, setQuoteId, setQuoteNumber, setQuoteIfExist, setSelectedClient, setSelectedClientType,clientTypesValue,isFromHomePage }) => {
    const user = useRecoilValue<any>(userState);
  const { callApi } = useGomakeAxios();
  const router = useRouter();

    const getAndSetExistQuote = async () => {
        const callBack = (res) => {
          if (res?.data?.succ) {
            const { result } = res.data;
            const { id, number, client } = result;
            setUserQuote(result);
            setQuoteId(id);
            setQuoteNumber(number);
            setQuoteIfExist(true);
            setSelectedClient(client);
            const clientType = clientTypesValue.find(
              (c) => c.id === client?.clientTypeId
            );
            setSelectedClientType(clientType);
          }
          else{
            setQuoteIfExist(false);
            setUserQuote(null);
            setQuoteId(null);
            setQuoteNumber(null);
            setSelectedClient(null);
            setSelectedClientType(null);
          }
        };
        await getIfCartExistApi(callApi, callBack, { documentType: 0 });
      };

    useEffect(() => {
        const socket = io(config.api_server);

        socket.on(`updateQuoteStatus-user-${user?.userId}`, () => {
            if(isFromHomePage){
                getAndSetExistQuote();
            }
            if(!isFromHomePage){
                router.push('/home');
            }
          });


        return () => {
            socket.disconnect();
        };
    }, []);

    return {
    };
};

export { updateQuoteStatusSocketIo };