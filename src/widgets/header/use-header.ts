import { useCustomer, useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  QuoteIfExistState,
  QuoteNumberState,
} from "@/pages-components/quote-new/store/quote";
import { selectedClientState } from "@/pages-components/quotes/states";
import { getIfCartExistApi } from "@/services/api-service/generic-doc/documents-api";
import { userQuoteState } from "@/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useResetRecoilState, useSetRecoilState } from "recoil";

const useHeader = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { user } = useCustomer();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [userQuote, setUserQuote] = useState<any>(null);
  const setQuoteIfExist = useSetRecoilState<any>(QuoteIfExistState);
  const setUserQuoteIfExist = useSetRecoilState<boolean>(userQuoteState);
  const setQuoteNumber = useSetRecoilState<any>(QuoteNumberState);
  const resetSelectedClient = useResetRecoilState(selectedClientState);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getAndSetExistQuote = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setUserQuote(res?.data?.result);
        setUserQuoteIfExist(res?.data?.succ);
      }
    };
    await getIfCartExistApi(callApi, callBack, { documentType: 0 }, false);
  };

  useEffect(() => {
    getAndSetExistQuote();
  }, []);

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
    t,
    user,
    open,
    anchorEl,
    handleClick,
    handleClose,
    navigate,
  };
};

export { useHeader };
