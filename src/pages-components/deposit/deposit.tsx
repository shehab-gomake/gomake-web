import { useStyle } from "./style";
import { DepositHeaderSection } from "./components/header-section";
import { useDeposit } from "./use-deposit";
import { DepositTable } from "./components/table-prices-section";
import { DepositFilterSection } from "./components/filters-section";
import { Skeleton, Stack } from "@mui/material";
import { DEPOSIT_ACTIONS } from "./enums";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useEffect } from "react";

export interface IDepositProps {
  actionType: DEPOSIT_ACTIONS;
}

const DepositPageWidget = ({ actionType }: IDepositProps) => {
  const { classes } = useStyle();
  const { depositsTabs, onSelectTab, renderTableHeaders, renderTableRows, getDepositMetaData, accounts, isLoading } = useDeposit();

  useEffect(() => {
    if (actionType === DEPOSIT_ACTIONS.Create)
      getDepositMetaData();
  }, []);

  return (
    <>
      <div style={classes.mainContainer}>
        <Stack direction="column" paddingLeft="20px" paddingRight="20px"  >
          <DepositHeaderSection actionType={actionType} />
          <div style={classes.borderSecondContainer} />
          {isLoading && actionType === DEPOSIT_ACTIONS.Create ? (
            <Skeleton variant="rectangular">
            <DepositFilterSection actionType={actionType} accountsOptions={accounts} />
            </Skeleton>
          ) : (
            <DepositFilterSection actionType={actionType} accountsOptions={accounts} />
          )}
        </Stack>
        <Stack style={classes.secondDivStyle}>
          {
            actionType === DEPOSIT_ACTIONS.Create ?
              <PrimaryTabsComponent tabs={depositsTabs} selectedColor="secondary" onSelectTab={onSelectTab} />
              :
              <DepositTable tableHeaders={renderTableHeaders} tableRows={renderTableRows()} />
          }
        </Stack>
      </div>
    </>
  );
};

export { DepositPageWidget };
