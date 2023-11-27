import React, { useState, useTransition } from "react";
import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";

const WriteCommentComp = () => {
  const { clasess } = useStyle();
  const [data, setData] = useState("");
  const { t } = useTranslation();
  return (
    <div style={clasess.writeCommentcontainer}>
      <GomakeTextInput
        style={clasess.textInputStyle}
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
