import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useStyle } from "./style";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuoteConfirmation } from "@/pages-components/quote-confirmation/use-quote-confirmation";
import { ERPDocumentsTypesEnum } from "@/enums";
import { useDateFormat } from "@/hooks/use-date-format";

interface IProps {
  key: string;
  item: any;
  index: number;
  parentIndex?: number;
  isPrePaymentPage?: boolean;
  isCanSelectRows?: boolean;
}

const DebtCard = ({ key, item, index, isCanSelectRows }: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { formatISODateTime } = useDateFormat();
  const { handleDebtItemCheck } = useQuoteConfirmation();

  return (
    <Card sx={classes.cardContainer} key={key}>
      <Stack direction={"column"} alignItems={"flex-start"} gap={"16px"}>
        <Stack sx={{ padding: "0px" }} direction="column" spacing={"4px"}>
          <Stack sx={classes.firstHeader}>
            {isCanSelectRows && (
              <Checkbox
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
                style={{ padding: "0px" }}
                checked={item?.isChecked}
                onChange={(checked) =>
                  handleDebtItemCheck(checked, item?.transId)
                }
              />
            )}
            <Typography sx={classes.headerStyle}>
              {t("sales.quote.item") + " #" + (index + 1)}
            </Typography>
          </Stack>
          <Typography sx={classes.detailsStyle}>
            {t(`ERPDocumentsType.${ERPDocumentsTypesEnum[item?.type]}`) +
              " • " +
              item?.docNum}
          </Typography>
        </Stack>
        <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>
          <Typography sx={classes.headerStyle}>
            {t("reports.documentDate")}
          </Typography>
          <Typography sx={classes.detailsStyle}>
            {item?.docDate
              ? formatISODateTime(item?.docDate).split(" ")[0]
              : "-"}
          </Typography>
        </Stack>

        <Stack sx={{ padding: "0px" }} direction="column" spacing={0}>
          <Typography sx={classes.headerStyle}>
            {t("sales.quote.price")}
          </Typography>
          <Typography sx={classes.detailsStyle}>{item?.price}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
export { DebtCard };
