import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { DoubleSidedTapeRollMapping } from "./double-sided-tape-roll-mapping";

import { useStyle } from "./style";
import { materialDoublesidedTapeRollState } from "../store/double-sided-tape-roll";

const AddDoubleSidedTapeRoll = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialDoublesidedTapeRollStateValue = useRecoilValue<any>(
    materialDoublesidedTapeRollState
  );

  return (
    <>
      <GoMakeModal
        openModal={
          materialDoublesidedTapeRollStateValue?.openAddApplicationsModal
        }
        modalTitle={t(
          "materials.doubleSidedTapeRolls.admin.addNewDoubleSidedTapeRoll"
        )}
        onClose={materialDoublesidedTapeRollStateValue?.onCloseModalAdded}
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
            {materialDoublesidedTapeRollStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <DoubleSidedTapeRollMapping
                    key={`doubleSidedTapeRollMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={
                materialDoublesidedTapeRollStateValue?.addDoubleSidedTapeRoll
              }
            >
              {t(
                "materials.doubleSidedTapeRolls.admin.addNewDoubleSidedTapeRoll"
              )}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddDoubleSidedTapeRoll };
