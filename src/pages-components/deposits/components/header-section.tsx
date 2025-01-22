import { Button } from "@mui/material";
import { HeaderTitle } from "@/widgets/header-title/header-title";
import { useStyle } from "../style";
import { useTranslation } from "react-i18next";
import { useGomakeRouter } from "@/hooks";
import { PlusIcon } from "@/pages-components/quotes/widgets/icons/header-section-icons";

const DepositsHeaderSection = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const { navigate } = useGomakeRouter();

  return (
    <div style={classes.headerStyle}>
      <HeaderTitle title={t("tabs.deposits")} marginTop={1} marginBottom={1} />
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
    </div>
  );
};
export { DepositsHeaderSection };
