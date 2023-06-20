import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";

import { useStyle } from "./style";

const AddSupplierModal = ({
  showSupplierModal,
  setShowSupplierModal,
  suppliers,
  setSelectedSupplier,
  onClickAddSupplier,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <>
      <GoMakeModal
        openModal={showSupplierModal}
        modalTitle={t("materials.sheetPaper.addSupplier")}
        onClose={() => setShowSupplierModal(false)}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.selectedSupplierContainer}>
          {suppliers?.length > 0 && (
            <>
              <GoMakeAutoComplate
                placeholder={t("materials.sheetPaper.selectASupplier")}
                options={suppliers}
                onChange={(value: any, item: any) => {
                  setSelectedSupplier(item?.value);
                }}
              />
              <GomakePrimaryButton
                style={{ marginTop: 20 }}
                onClick={onClickAddSupplier}
              >
                {t("materials.sheetPaper.addSupplier")}
              </GomakePrimaryButton>
            </>
          )}
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddSupplierModal };
