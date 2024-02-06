import { GomakeTextInput } from "@/components";
import { EditIcon } from "@/icons";
import { IconButton } from "@mui/material";
import React from "react";
import { useCharacterDetails } from "./use-character-details";
import { useStyleCharacterDetails } from "./style-character-details";

const CharacterDetails = ({ details, getQuote }) => {
  const { isEdit, showAll, truncatedDetails, data, handleShowLess, handleShowMore, t, setIsEdit, handleChange, handleBlur } = useCharacterDetails({ details, getQuote })
  const { clasess } = useStyleCharacterDetails({ showAll });
  return (
    <>
      {!isEdit ? <div
        style={clasess.mainContainer}
      >
        {truncatedDetails}
        {!showAll && ".. "}
        {details?.length > 90 && (
          <span
            onClick={showAll ? handleShowLess : handleShowMore}
            style={clasess.showAllContaner}
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
