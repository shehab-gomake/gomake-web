import React, { useState, useEffect, useRef } from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";
import { Stack, Checkbox, FormControlLabel } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import TermsPDF from "./TermsPDF";
import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const TermModal = ({ open, onClose, setIsTermsAccepted }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { primaryColor } = useGomakeTheme();
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
      const threshold = 5;
      if (scrollTop + clientHeight >= scrollHeight - threshold) {
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
    <GoMakeModal openModal={open} modalTitle={t("Terms and Conditions")} onClose={onClose} insideStyle={classes.insideStyle}>
      <Stack display={"flex"} direction={"column"} justifyContent={"space-between"} height={"100%"}>
        <div
            className={"show-scrollbar"}
            ref={contentRef}
            onScroll={handleScroll}
            style={{
              overflowY: "scroll",
              height: "90%",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: "10px",
              borderWidth: "1px",
              // border: "solid",
              // maxHeight: "300px",
              backgroundColor: "white",
            }}
        >
          <TermsPDF/>

        </div>
        <span style={{marginTop:5,textAlign:'right', color:"rgb(46, 48, 146)"}}>Scroll to accept terms.</span>
        <FormControlLabel
            control={
              <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  disabled={!isScrolledToBottom}
                  style={{color: primaryColor(500)}}
              />
            }
            label={t("I have read and accept the terms and conditions.")}
            style={{alignSelf: "center", marginTop: "10px"}}
        />
        <Stack direction={"row"} gap={"10px"} justifyContent={"end"}>
          <PrimaryButton style={{alignSelf: "center", width: "fit-content"}} variant="outlined" onClick={onClose}>
            {t("Decline")}
          </PrimaryButton>
          <PrimaryButton
              style={{alignSelf: "center", width: "fit-content"}}
              variant="contained"
              onClick={handleAcceptTerms}
              disabled={!isAcceptButtonEnabled}
          >
            {t("Accept")}
          </PrimaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export {TermModal };
