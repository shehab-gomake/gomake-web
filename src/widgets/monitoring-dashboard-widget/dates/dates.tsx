import { GoMakeDatepicker } from "@/components/datepicker";
import { useStyle } from "./style";
import { FixedDatesComponent } from "./fixed-dates-component";

const DashboardDates = () => {
  const { classes } = useStyle();
  return (
    <div style={classes.container}>
      <div style={classes.datesContainer}>
        {/* <FixedDatesComponent /> */}
        <GoMakeDatepicker />
      </div>
    </div>
  );
};

export { DashboardDates };
