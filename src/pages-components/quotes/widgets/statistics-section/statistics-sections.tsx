import { Button, Stack } from "@mui/material";
import { CardComponent } from "./card";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GoMakeCurrency } from "@/icons/go-make-currency";
import { EStatisticsLabels, QUOTE_STATUSES } from "../../enums";
import { useUserPermission } from "@/hooks/use-permission";
import { Permissions } from "@/components/CheckPermission/enum";

export interface ICard {
  key: string;
  value: string;
}

interface ICardsSection {
  statistics: ICard[];
  activeCard: any;
  onClick: () => void;
  onClickCard: (value1, value2) => void;
  onSecondClickCard: () => void;
}

const getValueByKey = (statistics: ICard[], key: string) => {
  const card = statistics?.find((item) => item.key === key);
  return card ? card.value : "";
};

const CardsSection = (props: ICardsSection) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { primaryColor, secondColor, warningColor, successColor, errorColor } =
    useGomakeTheme();
  const { CheckPermission } = useUserPermission();

  return (
    <Stack
      direction={"row"}
      gap={"5px"}
      alignItems={"center"}
      flexWrap={"wrap-reverse"}
    >
      {CheckPermission(Permissions.SHOW_QUOTE_STATISTICS) && (
        <>
          <CardComponent
            key={EStatisticsLabels.WAITING}
            onClick={() =>
              props.onClickCard(
                EStatisticsLabels.WAITING,
                QUOTE_STATUSES.Waiting
              )
            }
            isActive={props.activeCard === EStatisticsLabels.WAITING}
            text={t("sales.quote.waiting")}
            number={getValueByKey(props.statistics, "waitingCount")}
            textColor={`var(--theme-card-pending, ${warningColor(300)})`}
            icon={<HourglassTopIcon />}
            onSecondClick={props.onSecondClickCard}
          />
          <CardComponent
            key={EStatisticsLabels.APPROVED}
            onClick={() =>
              props.onClickCard(
                EStatisticsLabels.APPROVED,
                QUOTE_STATUSES.Approved
              )
            }
            isActive={props.activeCard === EStatisticsLabels.APPROVED}
            text={t("sales.quote.approved")}
            number={getValueByKey(props.statistics, "approvedCount")}
            textColor={`var(--theme-card-approved, ${successColor(300)})`}
            icon={<DoneAllIcon />}
            onSecondClick={props.onSecondClickCard}
          />
          <CardComponent
            key={EStatisticsLabels.CANCELED}
            onClick={() =>
              props.onClickCard(
                EStatisticsLabels.CANCELED,
                QUOTE_STATUSES.Canceled
              )
            }
            isActive={props.activeCard === EStatisticsLabels.CANCELED}
            text={t("sales.quote.rejected")}
            number={getValueByKey(props.statistics, "canceledCount")}
            textColor={errorColor(300)}
            icon={<DoDisturbAltIcon />}
            onSecondClick={props.onSecondClickCard}
          />
          <div style={classes.verticalLine} />
          <CardComponent
            text={t("sales.quote.successRate")}
            number={getValueByKey(props.statistics, "successRate") + "%"}
            textColor={`var(--theme-card-success-rate, ${primaryColor(300)})`}
            icon={<TrendingUpIcon />}
          />
          <CardComponent
            text={t("sales.quote.totalPrice")}
            number={getValueByKey(props.statistics, "totalPrice")}
            textColor={secondColor(100)}
            icon={<GoMakeCurrency color={secondColor(100)} />}
          />
        </>
      )}
      <Button
        sx={classes.createNew}
        onClick={props.onClick}
        startIcon={
          <AddCircleOutlineIcon
            style={{
              color: "var(--theme-text-primary, #101020)",
              fontSize: "24px",
            }}
          />
        }
      >
        {t("sales.quote.createNew")}
      </Button>
    </Stack>
  );
};

export { CardsSection };
