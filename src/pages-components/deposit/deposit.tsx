import { useStyle } from "./style";
import { DepositHeaderSection } from "./components/header-section";
import { useDeposit } from "./use-deposit";
import { DepositTable } from "./components/table-prices-section";
import { DepositFilterSection } from "./components/filters-section";
import { Stack } from "@mui/material";
import { DEPOSIT_ACTIONS } from "./enums";

export interface IDepositProps {
  actionType: DEPOSIT_ACTIONS;
}

const DepositPageWidget = ({ actionType }: IDepositProps) => {
  const { classes } = useStyle();
  const { renderTableHeaders , deposit } = useDeposit();

  return (
    <>
      <div style={classes.mainContainer}>
        <Stack direction="column" gap="30px" paddingLeft="20px" paddingRight="20px"  >
          <DepositHeaderSection actionType={actionType} />
                          {/* <span style={classes.lineDateStyle} />  */}

          <DepositFilterSection actionType={actionType} />
        </Stack>
        <Stack style={classes.secondDivStyle}>
          <DepositTable tableHeaders={renderTableHeaders} tableRows={[deposit,deposit]} />
        </Stack>
      </div>
    </>
  );
};

export { DepositPageWidget };
