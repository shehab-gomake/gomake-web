import React, { useState } from "react";
import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";

const WriteCommentComp = () => {
  const { clasess } = useStyle();
  const [data, setData] = useState("");
  return (
    <div style={clasess.writeCommentcontainer}>
      <GomakeTextInput
        style={clasess.textInputStyle}
        placeholder={"Write Your Comment here"}
        onChange={(e: any) => {
          setData(e.target.value);
        }}
        value={data}
      />
    </div>
  );
};

export { WriteCommentComp };
