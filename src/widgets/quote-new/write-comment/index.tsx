import React from "react";
import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useWriteCommentComp } from "./use-character-details";

const WriteCommentComp = ({ getQuote }) => {
  const { clasess } = useStyle();
  const { handleChange, handleBlur, t, data } = useWriteCommentComp({ getQuote })
  return (
    <div style={clasess.writeCommentcontainer}>
      <GomakeTextInput
        style={clasess.textInputStyle}
        placeholder={t("sales.quote.writeCommentHere")}
        onChange={handleChange}
        onBlur={handleBlur}
        value={data}
      />
    </div>
  );
};

export { WriteCommentComp };
