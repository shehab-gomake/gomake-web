import { GomakeTextInput } from "@/components";
import { EditIcon } from "@/icons";
import { IconButton } from "@mui/material";
import React, { CSSProperties, useState } from "react";
import { useCharacterDetails } from "./use-character-details";
import { useStyleCharacterDetails } from "./style-character-details";
import { FONT_FAMILY } from "@/utils/font-family";

interface IProps {
    details: any;
    getQuote:any;
    documentItemId:any;
    detailsStyle?:CSSProperties;
    showAllStyle?:CSSProperties;
}
const CharacterDetails = ({ details, getQuote, documentItemId , showAllStyle , detailsStyle}:IProps) => {
  const { isEdit, showAll, truncatedDetails, data, handleShowLess, handleShowMore, t, setIsEdit, handleChange, handleBlur } = useCharacterDetails({ details, getQuote, documentItemId })
  const { clasess } = useStyleCharacterDetails({ showAll });
  return (
    <>
      {!isEdit ? <div
        style={{...clasess.mainContainer,...detailsStyle}}
      >
        {truncatedDetails}
        {!showAll && ".. "}
        {details?.length > 90 && (
          <span
            onClick={showAll ? handleShowLess : handleShowMore}
            style={showAllStyle || {...clasess.showAllContaner}}
          >
            {showAll ? t("sales.quote.showLess") : t("sales.quote.showMore")}

          </span>
        )}
        <IconButton onClick={() => setIsEdit(true)} >
          <EditIcon />
        </IconButton>
      </div> : <div>
        <GomakeTextInput
          multiline={6}
          style={clasess.textInputEditing}
          onChange={handleChange}
          value={data}
          onBlur={handleBlur}
        />
      </div>}
    </>

  );
};
export { CharacterDetails };
