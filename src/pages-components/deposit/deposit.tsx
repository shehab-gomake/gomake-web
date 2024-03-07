import { useStyle } from "./style";
import { DepositHeaderSection } from "./components/header-section";
import { useDeposit } from "./use-deposit";
import { DepositTable } from "./components/table-prices-section";
import { DepositFilterSection } from "./components/filters-section";
import { Stack } from "@mui/material";
import { DEPOSIT_ACTIONS } from "./enums";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useEffect } from "react";
import { GomakeLoaderWidget } from "@/widgets";

export interface IDepositProps {
  actionType: DEPOSIT_ACTIONS;
}

const DepositPageWidget = ({ actionType }: IDepositProps) => {
  const { classes } = useStyle();
  const { depositsTabs, onSelectTab, renderTableHeaders, renderTableRows, getDepositMetaData, accounts, depositAccounts, isLoading, deposit } = useDeposit();

  useEffect(() => {
    if (actionType === DEPOSIT_ACTIONS.Create)
      getDepositMetaData();
  }, []);

  return (
    <>
      {isLoading && actionType === DEPOSIT_ACTIONS.Create ?
        <GomakeLoaderWidget />
        :
        <div style={classes.mainContainer}>
          <Stack direction="column" paddingLeft="20px" paddingRight="20px" width={"100%"}  >
            <DepositHeaderSection actionType={actionType} />
            <div style={classes.borderSecondContainer} />
            <DepositFilterSection actionType={actionType} accountsOptions={accounts} depositAccountsOptions={depositAccounts} />
          </Stack>
          <Stack style={classes.secondDivStyle}>
            {
              actionType === DEPOSIT_ACTIONS.Create ?
                <PrimaryTabsComponent tabs={depositsTabs} selectedColor="secondary" onSelectTab={onSelectTab} />
                :
                <DepositTable tableHeaders={renderTableHeaders()} tableRows={renderTableRows()} deposit={deposit} />
            }
          </Stack>
        </div>
      }
    </>
  );
};

export { DepositPageWidget };
