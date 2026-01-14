import { Button, Stack } from "@mui/material";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import { useEffect, useState } from "react";
import { getClientBalanceApi } from "@/services/api-service/customers/customers-api";
import { useGomakeAxios } from "@/hooks";
import { Typography } from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { WalletIcon } from "@/pages-components/quotes/widgets/icons/header-section-icons";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
interface IProps {
  clientId: string;
}

const ClientBalance = ({ clientId }: IProps) => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { callApi } = useGomakeAxios();
  const [balance, setBalance] = useState<number>();
  const { primarySecondaryBlend } = useGomakeTheme();
  useEffect(() => {
    if (clientId) {
      getClientBalanceApi(
        callApi,
        (res) => {
          if (res.success) {
            setBalance(res.data);
          }
        },
        clientId
      ).then();
    }
  }, [clientId]);

  return (
    <>
      <PermissionCheck userPermission={Permissions.SHOW_CLIENT_BALANCE}>
        {balance !== undefined && (
          <Stack direction="row" alignItems="center" gap={"3px"}>
            <Typography variant="body1" style={{ color: "#252675" }}>
              {t("home.clientBalance")}
            </Typography>
            :
            <Button
              disabled={true}
              startIcon={<WalletIcon stroke="#252675" />}
              sx={{
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px 12px",
                backgroundColor: primarySecondaryBlend(100),
                color: "#252675 !important",
                borderRadius: 16,
                ...FONT_FAMILY.Inter(500, 14),
                "& .MuiButton-startIcon": {
                  ...(direction === "rtl" && { margin: "0px 2px 0px 5px" }),
                },
              }}
            >
              {balance}
            </Button>
          </Stack>
        )}
      </PermissionCheck>
    </>
  );
};

export { ClientBalance };
