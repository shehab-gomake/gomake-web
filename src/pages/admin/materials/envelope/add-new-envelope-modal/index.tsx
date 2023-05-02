import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Tooltip } from "@mui/material";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { EnvelopeSizeMapping } from "./envelope-size-mapping";
import { materialEnvelopeState } from "../store/envelope";
import { useStyle } from "./style";

const AddNewEnvelopeModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
  );

  return (
    <>
      <GoMakeModal
        openModal={materialEnvelopesStateValue?.openAddNewEnvelopeModal}
        modalTitle={t("materials.envelops.admin.addNewEnvelops")}
        onClose={materialEnvelopesStateValue?.onCloseAddNewEnvelopeModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.sheetPaper.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.sheetPaper.admin.categoryName")}
                style={clasess.textInputStyle}
                value={materialEnvelopesStateValue?.categoryName}
                onChange={(e: any) => {
                  materialEnvelopesStateValue?.setCategoryName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.envelops.admin.envelopSizeSection")}
              </div>
              <Tooltip title={t("materials.envelops.admin.addEnvelopSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialEnvelopesStateValue?.items];
                    temp.push({
                      code: "",
                      name: "",
                      width: "",
                      height: "",
                      stock: "",
                      quantityInPackage: "",
                      isWithWindow: false,
                      defaultPrice: "",
                    });
                    materialEnvelopesStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("materials.envelops.admin.removeEnvelopSize")}>
                <IconButton
                  onClick={() => {
                    const temp = [...materialEnvelopesStateValue?.items];
                    temp.pop();
                    materialEnvelopesStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialEnvelopesStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <EnvelopeSizeMapping
                    key={`platSizeMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addBtnContainer}>
            <GomakePrimaryButton
              onClick={materialEnvelopesStateValue?.addNewEnvelopesSize}
            >
              {t("materials.envelops.admin.addNewEnvelops")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewEnvelopeModal };
