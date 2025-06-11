import { CustomerAuthLayout } from "@/layouts";
import CalendarTable from "@/widgets/employees-working-hours-widgets/calendar-table-compnent";
import { Permissions } from "../../components/CheckPermission/enum";

export default function () {
  return (
    <CustomerAuthLayout staticPageTitle={"employees working hours"}
      permissionEnumValue={Permissions.SHOW_EMPLOYEE_WORKING_HOURS}
    >
      <CalendarTable />
    </CustomerAuthLayout>
  );
}
