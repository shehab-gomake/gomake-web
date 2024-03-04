import { useStyle } from "./style";
import { DepositHeaderSection } from "./components/header-section";
import { useDeposit } from "./use-deposit";
import { DepositTable } from "./components/table-prices-section";
import { DepositFilterSection } from "./components/filters-section";
import { Stack } from "@mui/material";
import { DEPOSIT_ACTIONS } from "./enums";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useEffect } from "react";

export interface IDepositProps {
  actionType: DEPOSIT_ACTIONS;
}

const DepositPageWidget = ({ actionType }: IDepositProps) => {
  const { classes } = useStyle();
  const { depositsTabs, handleResetTotalAndCount, renderTableHeaders, renderTableRows, getDepositMetaData, accounts } = useDeposit();

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
          <DepositFilterSection actionType={actionType} accountsOptions={accounts} />
        </Stack>
        <Stack style={classes.secondDivStyle}>
          {
            actionType === DEPOSIT_ACTIONS.Create ?
              <PrimaryTabsComponent tabs={depositsTabs} selectedColor="secondary" onSelectTab={handleResetTotalAndCount} />
              :
              <DepositTable tableHeaders={renderTableHeaders} tableRows={renderTableRows()} />
          }
        </Stack>
      </div>
    </>
  );
};

export { DepositPageWidget };
