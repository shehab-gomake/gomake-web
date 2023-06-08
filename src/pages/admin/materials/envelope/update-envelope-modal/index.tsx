import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GoMakeModal, GomakeTextInput } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AddEnvelopeSizeWeightsMapping } from "./add-envelope-size-mapping";
import { EnvelopeWeightsMapping } from "./envelope-size-mapping";
import { materialEnvelopeState } from "../store/envelope";
import { useStyle } from "./style";

const UpdateEnvelopeModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
  );
  const selectedItem = materialEnvelopesStateValue?.selectedEditItem;

  return (
    <>
      <GoMakeModal
        openModal={materialEnvelopesStateValue?.openUpdateEnvelopeModal}
        modalTitle={`Edit ${selectedItem?.categoryName} Envelope`}
        onClose={materialEnvelopesStateValue?.onCloseUpdateModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.inputs.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.inputs.categoryName")}
                style={clasess.textInputStyle}
                value={selectedItem?.categoryName}
                disabled={true}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.envelops.admin.envelopSizeSection")}
              </div>
              {!materialEnvelopesStateValue?.isAddNewEnvelopeWights && (
                <Tooltip title={t("materials.envelops.admin.addEnvelopSize")}>
                  <IconButton
                    onClick={() => {
                      materialEnvelopesStateValue.setItems([
                        {
                          code: "",
                          name: "",
                          width: "",
                          height: "",
                          stock: "",
                          quantityInPackage: "",
                          isWithWindow: false,
                          defaultPrice: "",
                        },
                      ]);
                      materialEnvelopesStateValue?.setIsAddNewEnvelopeWights(
                        true
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            {materialEnvelopesStateValue?.isAddNewEnvelopeWights && (
              <AddEnvelopeSizeWeightsMapping
                index={0}
                selectedItem={selectedItem}
              />
            )}
            {selectedItem?.envelopeSizes?.map((item: any, index: number) => {
              return (
                <EnvelopeWeightsMapping
                  key={`platSizeMapping_${index}`}
                  index={index}
                  item={item}
                  selectedItem={selectedItem}
                />
              );
            })}
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateEnvelopeModal };
