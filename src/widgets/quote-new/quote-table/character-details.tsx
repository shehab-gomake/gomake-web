import { GomakeTextInput } from "@/components";
import { EditIcon } from "@/icons";
import { IconButton } from "@mui/material";
import React, { CSSProperties, useState } from "react";
import { useCharacterDetails } from "./use-character-details";
import { useStyleCharacterDetails } from "./style-character-details";

interface IProps {
  details: any;
  getQuote?: any;
  documentItemId?: any;
  detailsStyle?: CSSProperties;
  showAllStyle?: CSSProperties;
  isQuoteConfirmation?: boolean;
}
const CharacterDetails = ({ details, getQuote, documentItemId, showAllStyle, detailsStyle, isQuoteConfirmation = false }: IProps) => {
  const { isEdit, showAll, truncatedDetails, data, handleShowLess, handleShowMore, t, setIsEdit, handleChange, handleBlur } = useCharacterDetails({ details, getQuote, documentItemId })
  const { classes } = useStyleCharacterDetails({ showAll });
  return (
    <>
      {!isEdit ?
        <div style={{ ...classes.mainContainer, ...detailsStyle }}>
          {truncatedDetails}
          {!showAll && ".. "}
          {details?.length > 90 && (
            <span
              onClick={showAll ? handleShowLess : handleShowMore}
              style={showAllStyle || { ...classes.showAllContaner }}
            >
              {showAll ? t("sales.quote.showLess") : t("sales.quote.showMore")}
            </span>
          )}
          {!isQuoteConfirmation && <IconButton onClick={() => setIsEdit(true)} >
            <EditIcon />
          </IconButton>}
        </div> :
        <div>
          <GomakeTextInput
            multiline={6}
            style={classes.textInputEditing}
            onChange={handleChange}
            value={data}
            onBlur={handleBlur}
          />
        </div>}
    </>

  );
};
export { CharacterDetails };
