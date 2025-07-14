import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TotalCardComponent } from "@/pages-components/quotes/widgets/statistics-section/total-card";
import {
  ItemsCountIcon,
  WalletIcon,
} from "@/pages-components/quotes/widgets/icons/header-section-icons";
import { useStyle } from "./style";

interface Props {
  data: {
    totalCredit: number;
    totalDebit: number;
    totalRecords: number;
  } | null;
}

export const TransactionSummaryCards = ({ data }: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  if (!data) {
    return (
      <div style={classes.rowStyle}>
        <Skeleton variant="rectangular" sx={classes.skeltonStyle} />
        <Skeleton variant="rectangular" sx={classes.skeltonStyle} />
        <Skeleton variant="rectangular" sx={classes.skeltonStyle} />
      </div>
    );
  }

  return (
    <div style={classes.rowStyle}>
      <TotalCardComponent
        text={t("reports.totalRecords")}
        number={data?.totalRecords}
        icon={<ItemsCountIcon />}
      />
      <TotalCardComponent
        text={t("reports.totalDebit")}
        number={data?.totalDebit.toFixed(2)}
        icon={<WalletIcon />}
        withCurrency
      />
      <TotalCardComponent
        text={t("reports.totalCredit")}
        number={data?.totalCredit.toFixed(2)}
        icon={<WalletIcon />}
        withCurrency
      />
    </div>
  );
};
