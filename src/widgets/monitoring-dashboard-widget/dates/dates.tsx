import { GoMakeDatepicker } from "@/components/datepicker";
import { FixedDatesComponent } from "@/widgets/dashboard-widget/dates/fixed-dates-component";
import { useStyle } from "./style";

const DashboardDates = () => {
  const { classes } = useStyle();
  return (
    <div style={classes.container}>
      <div style={classes.datesContainer}>
        <FixedDatesComponent />
        <GoMakeDatepicker />
      </div>
    </div>
  );
};

export { DashboardDates };
