import { GoMakeDatepicker } from "@/components/datepicker";
import { AgentsList } from "@/widgets/agents/agents-list";
import { DashboardClientsList } from "../clients/clients-select";
import { useStyle } from "./style";

//!here
const DashboardDates = () => {
  const { classes } = useStyle();
  return (
    <div style={classes.container}>
      <div style={classes.datesContainer}>
        {/* <FixedDatesComponent/> */}
        <GoMakeDatepicker />
        <AgentsList />
        {/* <DashboardClientsList /> */}
      </div>
    </div>
  );
};

export { DashboardDates };
