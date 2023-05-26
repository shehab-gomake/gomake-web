import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const AddQuantityModal = ({ openModal, onCloseModal }: any) => {
  const { t } = useTranslation();

  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Add quantity"
        onClose={onCloseModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <GomakeTextInput
            placeholder="Quantity"
            style={clasess.textInputStyle}
            // value={materialAdditionsStateValue?.items[index]["name"]}
            // onChange={(e: any) => {
            //   materialAdditionsStateValue?.changeItems(
            //     index,
            //     "name",
            //     e.target.value
            //   );
            // }}
          />
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton style={clasess.btnStyle}>
              Add
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { AddQuantityModal };
