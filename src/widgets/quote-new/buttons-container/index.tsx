import React, { useState } from "react";
import { useStyle } from "./style";
import {
  AddPlusIcon,
  ArrowDownNewIcon,
  PlusIcon,
  UploadNewIcon,
} from "@/icons";
import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";

const ButtonsContainer = ({ onOpenNewItem }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div style={clasess.writeCommentcontainer}>
      <div style={clasess.btnsContainer}>
        <GomakePrimaryButton
          leftIcon={<PlusIcon stroke={"#344054"} />}
          style={clasess.btnContainer}
          onClick={() => onOpenNewItem()}
        >
          {t("sales.quote.addNewItems")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          leftIcon={<PlusIcon stroke={"#344054"} />}
          style={clasess.btnContainer}
        >
          {t("sales.quote.addExistItem")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          leftIcon={<PlusIcon stroke={"#344054"} />}
          style={clasess.btnContainer}
        >
          {t("sales.quote.addDelivery")}
        </GomakePrimaryButton>
      </div>
      <div style={clasess.btnsContainer}>
        <GomakePrimaryButton
          leftIcon={<UploadNewIcon />}
          style={clasess.btnSecondContainer}
        >
          Attach Files
        </GomakePrimaryButton>
        <GomakePrimaryButton
          rightIcon={<ArrowDownNewIcon />}
          style={clasess.btnSecondContainer}
        >
          Copy to
        </GomakePrimaryButton>
        <GomakePrimaryButton
          rightIcon={<ArrowDownNewIcon />}
          style={clasess.btnSecondContainer}
        >
          Send
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnSecondContainer}>
          Print
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnSecondContainer}>
          Cancel
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnThirdContainer}>
          Save
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnThirdContainer}>
          Manager Approval
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnOrderNowContainer}>
          Order Now
        </GomakePrimaryButton>
      </div>
    </div>
  );
};

export { ButtonsContainer };
