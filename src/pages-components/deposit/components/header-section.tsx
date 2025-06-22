import { HeaderTitle } from "@/widgets/header-title/header-title";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { depositState } from "@/pages-components/deposits/components/states";
import { DEPOSIT_ACTIONS } from "../enums";
import { Button } from "@mui/material";
import { useGomakeRouter } from "@/hooks/use-gomake-router";
import { PlusIcon } from "@/pages-components/quotes/widgets/icons/header-section-icons";

interface IHeaderSection {
  actionType: DEPOSIT_ACTIONS;
}

const DepositHeaderSection = ({ actionType }: IHeaderSection) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const deposit = useRecoilValue<any>(depositState);
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const { navigate } = useGomakeRouter();

  return (
    <div style={classes.titleContainer}>
      <HeaderTitle
        title={
          actionType === DEPOSIT_ACTIONS.Show
            ? `${t("deposits.deposit")} - ${deposit?.number}`
            : t("deposits.createNew")
        }
        marginBottom={1}
        marginTop={1}
        color="rgba(241, 53, 163, 1)"
      />

      {actionType === DEPOSIT_ACTIONS.Show && (
        <Button
          sx={{
            ...classes.createNewDocument,
            "& .MuiButton-startIcon": {
              ...(RTL
                ? { marginLeft: "4px", marginRight: 0 }
                : { marginRight: "4px", marginLeft: 0 }),
            },
          }}
          onClick={() => navigate(`/deposits/create`)}
          startIcon={<PlusIcon />}
        >
          {t("sales.quote.createNew")}
        </Button>
      )}
    </div>
  );
};
export { DepositHeaderSection };
