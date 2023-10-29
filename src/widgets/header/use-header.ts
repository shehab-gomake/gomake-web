import { useCustomer, useGomakeRouter } from "@/hooks";
import { QuoteIfExistState } from "@/pages-components/quote/store/quote";
import { useState } from "react";
import { useRecoilState } from "recoil";

const useHeader = () => {
  const { navigate } = useGomakeRouter();
  const { user } = useCustomer();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [QuoteIfExist, setQuoteIfExist] = useRecoilState<any>(QuoteIfExistState);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickQuoteExist = () =>{
    navigate(
      `/quote`
    );
  }
  return { user, open, anchorEl, handleClick, handleClose, navigate,handleClickQuoteExist };
};

export { useHeader };
