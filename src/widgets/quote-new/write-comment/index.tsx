import React, { useState, useTransition } from "react";
import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";

interface IProps {
  isQuoteConfirmation?: boolean;
}
const WriteCommentComp = ({isQuoteConfirmation} : IProps) => {
  const { classes } = useStyle(isQuoteConfirmation);
  const [data, setData] = useState("");
  const { t } = useTranslation();
  return (
    <div style={classes.writeCommentContainer}>
      <GomakeTextInput
        style={classes.textInputStyle}
        placeholder={t("sales.quote.writeCommentHere")}
        onChange={(e: any) => {
          setData(e.target.value);
        }}
        value={data}
      />
    </div>
  );
};

export { WriteCommentComp };
