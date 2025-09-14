import React from "react";
import { useTranslation } from "react-i18next";
import { GomakePrimaryButton } from "@/components";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ErrorIcon } from "@/icons";
import { _renderIconLogs } from "@/utils/constants";
import { renderExceptionMessage } from "@/utils/helpers";
import { IExceptionsLog } from "@/widgets/product-pricing-widget/interface";

interface CalculationErrorsModalWidgetProps {
    errors: IExceptionsLog[];
    onClose: () => void;
    clasess: any;
}

const CalculationErrorsModalWidget = ({ errors, onClose, clasess }: CalculationErrorsModalWidgetProps) => {
    const { t } = useTranslation();
    const { errorColor } = useGomakeTheme();

    // Filter only error items from logsArray
    const errorItems = errors?.filter(item =>
        item?.actionName !== null
    ) || [];

    const renderErrorText = (item: IExceptionsLog) => {
        return `${item.actionName ? item.actionName + ": " : ""}${renderExceptionMessage(
            item?.exceptionKey || item?.exception?.exceptionKey,
            [],
            t
        )}`;
    };

    return (
        <div style={clasess.mainContainerErrors}>
            <div style={clasess.iconContainer}>
                <ErrorIcon width={40} height={40} fill={errorColor(500)} />
            </div>

            <div>
                <div style={clasess.titleStyleErrors}>
                    {t("products.offsetPrice.admin.validationErrors")}
                </div>
                <div style={clasess.subTitleStyle}>
                    {t("products.offsetPrice.admin.validationErrorsTitle")}
                </div>
            </div>

            <div style={clasess.errorsContainer}>
                {errorItems.map((item, index) => (
                    <div key={index} style={clasess.errorItem}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <div style={{ marginTop: 2 }}>
                                {_renderIconLogs(
                                    item?.exception?.exceptionType,
                                    16,
                                    16
                                )}
                            </div>
                            <span style={clasess.errorText}>
                                {renderErrorText(item)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={clasess.summaryContainerErrors}>
                <span style={clasess.summaryText}>
                    {errorItems.length} {t("products.offsetPrice.admin.errorsFound")}
                </span>
            </div>

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

export { CalculationErrorsModalWidget };
