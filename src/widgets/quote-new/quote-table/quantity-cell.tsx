import { styled, Tooltip, tooltipClasses } from "@mui/material";
import { InputUpdatedValues } from "../input-updated-values";
import { ECalculationStatus } from "@/enums/document-type-enum";
import { OrderBadge } from "@/icons/order-badge";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

// Render quantity cell with special styling for closed items
const QuoteQuantityCell = ({
  classes,
  item,
  isQuoteConfirmation,
  quoteItems,
  onBlurApproveAmount,
  isUpdateApproveAmount,
  setIsUpdateApproveAmount,
  onInputChangeAmount,
  canUpdatePricesBasedOnType,
  isUpdateAmount,
  setIsUpdateAmount,
  onBlurAmount,
  isPrePaymentPage,
  t,
}) => {
  const { primarySecondaryBlend } = useGomakeTheme();
  const quantityContent = (
    <div style={classes.cellTextInputStyle}>
      {item?.calculationStatus === null ||
      item?.calculationStatus === undefined ||
      item?.calculationStatus === ECalculationStatus.Done ? (
        isQuoteConfirmation ? (
          <InputUpdatedValues
            value={item?.quantity}
            onBlur={onBlurApproveAmount}
            isUpdate={
              quoteItems?.isCanUpdateQuantity &&
              isUpdateApproveAmount &&
              !isPrePaymentPage
            }
            setIsUpdate={setIsUpdateApproveAmount}
            onInputChange={(e) => onInputChangeAmount(e)}
            // Enhanced styling for closed items
            specialStyle={
              item?.isClosed
                ? {
                    color: primarySecondaryBlend(400),
                    fontWeight: 700,
                    backgroundColor: "rgba(88, 89, 168, 0.08)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    border: "1.5px solid rgba(88, 89, 168, 0.3)",
                    transition: "all 0.2s ease",
                  }
                : {}
            }
          />
        ) : (
          <InputUpdatedValues
            value={item?.quantity}
            onBlur={onBlurAmount}
            isUpdate={
              canUpdatePricesBasedOnType && isUpdateAmount && !isPrePaymentPage
            }
            setIsUpdate={setIsUpdateAmount}
            onInputChange={(e) => onInputChangeAmount(e)}
            // Enhanced styling for closed items
            specialStyle={
              item?.isClosed
                ? {
                    color: primarySecondaryBlend(400),
                    fontWeight: 600,
                    backgroundColor: "rgba(88, 89, 168, 0.08)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    border: "1.5px solid rgba(88, 89, 168, 0.3)",
                    transition: "all 0.2s ease",
                  }
                : {}
            }
          />
        )
      ) : (
        "-"
      )}
    </div>
  );

  // Wrap with enhanced tooltip if item is closed and has order number
  if (item?.isClosed && item?.sourceDocumentNumber) {
    return (
      <CustomTooltip
        title={
          <>
            <OrderBadge />
            <span>
              {t("mailingSettings.orderNumber")}:{" "}
              <strong>{item.sourceDocumentNumber}</strong>
            </span>
          </>
        }
        placement="top"
        arrow
        enterDelay={100}
        leaveDelay={0}
      >
        <ClosedItemWrapper primarySecondaryBlend={primarySecondaryBlend}>
          {quantityContent}
        </ClosedItemWrapper>
      </CustomTooltip>
    );
  }

  return <>{quantityContent}</>;
};
export { QuoteQuantityCell };

// Custom styled tooltip with beautiful design
const CustomTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }: any) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#2D3748",
    color: "#FFFFFF",
    fontSize: "13px",
    fontWeight: 500,
    padding: "8px 16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    maxWidth: "none",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#2D3748",
  },
}));

const ClosedItemWrapper = styled("div")<{
  primarySecondaryBlend?: (degree: number) => string;
}>(({ theme, primarySecondaryBlend }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: primarySecondaryBlend
      ? primarySecondaryBlend(400)
      : "#5859A8",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "50%": {
      transform: "scale(1.2)",
      opacity: 0.7,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
}));
