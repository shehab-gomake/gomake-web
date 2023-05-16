import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";

import { useStyle } from "./style";

const AddExceptionModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <GoMakeModal
        // openModal={materialApplicationsStateValue?.openUpdatalApplicationModal}
        // modalTitle={""}
        // onClose={materialApplicationsStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div>ffff</div>
      </GoMakeModal>
    </>
  );
};
export { AddExceptionModal };
