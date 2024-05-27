import React, { useState, useEffect, useRef } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { Stack, Checkbox, FormControlLabel } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import TermsPDF from "./TermsPDF";

const TermModal = ({ open, onClose, setIsTermsAccepted }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isAcceptButtonEnabled, setIsAcceptButtonEnabled] = useState(false);
  const contentRef = useRef(null);

  const handleAcceptTerms = async () => {
    try {
      await callApi("POST", "/v1/crm-service/update-terms-accepted");
      setIsTermsAccepted(true);
      navigate("/");
    } catch (error) {
      console.error("Failed to accept terms", error);
    }
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setIsScrolledToBottom(true);
      }
    }
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      setIsAcceptButtonEnabled(isChecked);
    }
  }, [isScrolledToBottom, isChecked]);

  return (
    <GoMakeModal openModal={open} modalTitle={"Terms and Conditions"} onClose={onClose} insideStyle={classes.insideStyle}>
      <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} height={"100%"}>
        <div
          ref={contentRef}
          onScroll={handleScroll}
          style={{ overflowY: "scroll", maxHeight: "300px", padding: "10px", backgroundColor: "green" }}
        >
          <TermsPDF />
        </div>
        <FormControlLabel
          control={
            <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} disabled={!isScrolledToBottom} />
          }
          label={t("I have read and accept the terms and conditions.")}
          style={{ alignSelf: "center", marginTop: "10px" }}
        />
        <Stack direction={"row"} gap={"10px"} justifyContent={"end"}>
          <SecondaryButton style={{ alignSelf: "center" }} variant="outlined" onClick={onClose}>
            {t("Decline")}
          </SecondaryButton>
          <SecondaryButton
            style={{ alignSelf: "center" }}
            variant="contained"
            onClick={handleAcceptTerms}
            disabled={!isAcceptButtonEnabled}
          >
            {t("Accept")}
          </SecondaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { TermModal };
