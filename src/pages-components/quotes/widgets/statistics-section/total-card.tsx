import { Card, CardContent, Typography } from "@mui/material";
import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { systemCurrencyState } from "@/store";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";

interface ICardProps {
  text?: string;
  number?: string | number;
  icon?: JSX.Element;
  withCurrency?: boolean;
}

const TotalCardComponent = ({
  text,
  number,
  icon,
  withCurrency = false,
}: ICardProps) => {
  const { classes } = useStyle();
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const { getCurrencyUnitText } = useQuoteGetData();

  return (
    <Card sx={classes.cardContainerStyle}>
      <CardContent style={classes.ticketContent}>
        <Typography sx={classes.totalTextStyle} color="#FFFFFF">
          {icon}
          {text}
        </Typography>
        <Typography sx={classes.numStyle} color="#FFFFFF">
          {number}
          {/* {withCurrency && (
            <Typography
              component="span"
              sx={{ fontSize: "0.7em", verticalAlign: "top", ml: 0.5 }}
            >
              {systemCurrency}
            </Typography>
          )} */}
          {withCurrency && (
            <Typography
              component="span"
              sx={{ fontSize: "0.7em", verticalAlign: "bottom", ml: 0.2 }}
            >
              {getCurrencyUnitText(systemCurrency)}
            </Typography>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};

export { TotalCardComponent };
