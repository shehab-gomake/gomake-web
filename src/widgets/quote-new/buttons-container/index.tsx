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

const ButtonsContainer = ({
  onOpenNewItem,
  handleCancelBtnClick,
  handleSendBtnClick,
}) => {
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
          {t("sales.quote.attachFiles")}
        </GomakePrimaryButton>
        {/* <GomakePrimaryButton
          rightIcon={<ArrowDownNewIcon />}
          style={clasess.btnSecondContainer}
        >
          {t("sales.quote.copyTo")}
        </GomakePrimaryButton> */}
        <GomakePrimaryButton
          rightIcon={<ArrowDownNewIcon />}
          style={clasess.btnSecondContainer}
          onClick={handleSendBtnClick}
        >
          {t("login.send")}
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnSecondContainer}>
          {t("sales.quote.print")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          style={clasess.btnSecondContainer}
          onClick={handleCancelBtnClick}
        >
          {t("materials.buttons.cancel")}
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnThirdContainer}>
          {t("materials.buttons.save")}
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnThirdContainer}>
          {t("sales.quote.managerApproval")}
        </GomakePrimaryButton>
        <GomakePrimaryButton style={clasess.btnOrderNowContainer}>
          {t("sales.quote.orderNowTitle")}
        </GomakePrimaryButton>
      </div>
    </div>
  );
};

export { ButtonsContainer };
