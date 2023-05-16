import { useTranslation } from "react-i18next";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";

import { useStyle } from "./style";
import { profitsState } from "../../store/profits";
import { useRecoilValue } from "recoil";

const AddExceptionModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  return (
    <>
      <GoMakeModal
        openModal={profitsStateValue?.openAddExceptionModal}
        modalTitle={t("products.profits.exceptions.addNewException")}
        onClose={profitsStateValue?.onCloseAddExceptionModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.selectTypeStyle}>Select type of exception</div>
        <GoMakeAutoComplate
          options={[
            { label: "Machines", value: "machine" },
            { label: "Products", value: "product" },
            { label: "Clients", value: "client" },
            { label: "Parameters", value: "parameter" },
          ]}
          placeholder={t("products.profits.exceptions.selectTypeOfException")}
        />
      </GoMakeModal>
    </>
  );
};
export { AddExceptionModal };
