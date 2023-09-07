import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/settings-users/users/components/add-employee/components/working-days-form/style";

const WorkingDaysForm = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
  return (
      <div>working days</div>
  );
}

export {WorkingDaysForm}