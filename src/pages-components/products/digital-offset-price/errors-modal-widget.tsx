import React from "react";
import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ErrorIcon } from "@/icons";

const ErrorsModalWidget = ({ errors, onClose, clasess }) => {
  const { t } = useTranslation();
  const { errorColor } = useGomakeTheme();

  const errorList = typeof errors === 'string'
    ? errors.split(', ').filter(error => error.trim())
    : Array.isArray(errors)
      ? errors
      : [];

  return (
    <div style={clasess.mainContainerErrors}>
      {/* <div style={clasess.iconContainer}>
        <ErrorIcon width={40} height={40} fill={errorColor(500)} />
      </div> */}

      <div>
        <div style={clasess.titleStyleErrors}>
          {t("products.offsetPrice.admin.validationErrors")}
        </div>
        <div style={clasess.subTitleStyle}>
          {t("products.offsetPrice.admin.validationErrorsTitle")}
        </div>
      </div>

      <div style={clasess.errorsContainer}>
        {errorList.map((error, index) => (
          <div key={index} style={clasess.errorItem}>
            <div style={clasess.bulletPoint}></div>
            <span style={clasess.errorText}>{error}</span>
          </div>
        ))}
      </div>

      {/* <div style={clasess.summaryContainerErrors}>
        <span style={clasess.summaryText}>
          {errorList.length} {t("products.offsetPrice.admin.errorsFound")}
        </span>
      </div> */}

      <div style={clasess.buttonContainer}>
        <GomakePrimaryButton
          style={clasess.confirmBtnErrors}
          onClick={onClose}
        >
          {t("products.offsetPrice.admin.understood")}
        </GomakePrimaryButton>
      </div>
    </div>
  );
};

export { ErrorsModalWidget };