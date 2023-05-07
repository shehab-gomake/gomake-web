import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { MagnetMapping } from "./magnet-mapping";

import { useStyle } from "./style";
import { materialMagnetState } from "../store/magnets";

const AddMagnet = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialMagnetStateValue = useRecoilValue<any>(materialMagnetState);

  return (
    <>
      <GoMakeModal
        openModal={materialMagnetStateValue?.openAddMagnetModal}
        modalTitle={t("materials.magnets.admin.addNewMagnet")}
        onClose={materialMagnetStateValue?.onCloseModalAdded}
        insideStyle={clasess.insideStyle}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={clasess.secondSectionContainer}>
            {materialMagnetStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <MagnetMapping key={`magnetMapping${index}`} index={index} />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton onClick={materialMagnetStateValue?.addMagnet}>
              {t("materials.magnets.admin.addNewMagnet")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddMagnet };
