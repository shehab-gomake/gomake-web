import { useCustomer, useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote-new/store/quote";
import { selectedClientState } from "@/pages-components/quotes/states";
import { getIfCartExistApi } from "@/services/api-service/generic-doc/documents-api";
import { userQouteState } from "@/store";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";

const useHeader = () => {
  const { navigate } = useGomakeRouter();
  const { user } = useCustomer();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorNotifyEl, setAnchorNotifyEl] = useState<null | HTMLElement>(
    null
  );
  const [QuoteIfExist, setQuoteIfExist] =
    useRecoilState<any>(QuoteIfExistState);
  const { callApi } = useGomakeAxios();
  const open = Boolean(anchorEl);
  const openNotify = Boolean(anchorNotifyEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickNotify = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNotifyEl(event.currentTarget);
  };
  const handleCloseNotify = () => {
    setAnchorNotifyEl(null);
  };

  const handleClickQuoteExist = () => {
    navigate(`/quote`);
  };
  const [userQuote, setUserQuote] = useState<any>(null);
  const [userQuoteIfExist, setUserQuoteIfExist] = useRecoilState<boolean>(userQouteState);
  const getAndSetExistQuote = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setUserQuote(res?.data?.result);
        setUserQuoteIfExist(res?.data?.succ)
      }
    };
    await getIfCartExistApi(callApi, callBack, { documentType: 0 }, false);
  };
  useEffect(() => {
    getAndSetExistQuote();
  }, []);
  const setQuoteNumber = useSetRecoilState<any>(QuoteNumberState);
  const resetSelectedClient = useResetRecoilState(selectedClientState);

  useEffect(() => {
    if (window.location.pathname != "/home") {
      if (userQuote) {
        setQuoteNumber(userQuote.number);
        setQuoteIfExist(true);
      } else {
        resetSelectedClient();
        setQuoteNumber(null);
        setQuoteIfExist(false);
      }
    }
  }, [userQuote]);
  
  return {
    user,
    open,
    anchorEl,
    handleClick,
    handleClose,
    navigate,
    handleClickQuoteExist,
    openNotify,
    anchorNotifyEl,
    handleClickNotify,
    handleCloseNotify,
  };
};

export { useHeader };
