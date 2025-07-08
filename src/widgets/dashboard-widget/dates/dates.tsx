import { useStyle } from "@/widgets/dashboard-widget/dates/style";
import { MachineList } from "@/widgets";
import { GoMakeDatepicker } from "@/components/datepicker";
import { AgentsList } from "@/widgets/agents/agents-list";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { DashboardClientsList } from "@/widgets/dashboard-widget/clients/clients-select";
import { FixedDatesComponent } from "@/widgets/dashboard-widget/dates/fixed-dates-component";
import { useRecoilValue } from "recoil";
import { DashboardActions, dashboardDateState } from "@/store/dashboard-date";

const DashboardDates = ({ handelSearchValueChange }) => {
  const { classes } = useStyle();
  const dashboardDate = useRecoilValue(dashboardDateState);

  return (
    <div style={classes.container}>
      <div style={classes.datesContainer}>
        <SearchInputComponent
          onChange={handelSearchValueChange}
          searchInputStyle={{ width: 300, height: 36 }}
        />
        <FixedDatesComponent />
        {dashboardDate.action === DashboardActions.DATE_RANGE_BOARDS && (
          <GoMakeDatepicker />
        )}
        <MachineList />
        <AgentsList />
        <DashboardClientsList />
      </div>
    </div>
  );
};

export { DashboardDates };
