import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { AddPlusIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { DeleteMenuIcon } from "@/widgets/quote/more-circle/icons/delete-menu";
import { useAddRuleModal } from "./use-add-rule-modal";

const AddRuleModal = ({ openModal, onCloseModal }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const {
    value,
    expression,
    mainconditions,
    categories,
    fields,
    fieldsStates,
    firstPartDefultValue,
    conditions,
    secondPartTypeState,
    removeFields,
    handleNumberField,
    create,
    setFields,
    addFields,
    handleFormChange,
  } = useAddRuleModal();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("products.profits.exceptions.addNewRule")}
        onClose={() => {
          onCloseModal();
          setFields([
            {
              linkCondition: "",
              category: "",
              firstPart: "",
              condition: "",
              secondPart: "",
            },
          ]);
        }}
        insideStyle={clasess.insideStyle}
      >
        <form>
          {fields.map((field, index) => {
            return (
              <div key={index}>
                {index != 0 && (
                  <div
                    style={{
                      display: "block",
                      marginTop: 30,
                      marginBottom: 30,
                    }}
                  >
                    <label style={clasess.inputLable}>
                      {t("properties.condtionBetween")}
                    </label>
                    <GoMakeAutoComplate
                      options={mainconditions}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.condtion")}
                      value={field.linkCondition}
                      onChange={(event, value) => {
                        handleFormChange(index, event, 1, value);
                      }}
                    />
                  </div>
                )}

                <div style={clasess.inputsContainer}>
                  <div style={{ marginTop: "2%", fontSize: 16 }}> if</div>
                  <div>
                    <label style={clasess.inputLable}>
                      {t("properties.category")}
                    </label>
                    <GoMakeAutoComplate
                      options={categories}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.category")}
                      value={field.category}
                      onChange={(event, value) => {
                        handleFormChange(index, event, 2, value);
                      }}
                    />
                  </div>
                  <div>
                    <label style={clasess.inputLable}>
                      {t("properties.statment")}
                    </label>
                    <GoMakeAutoComplate
                      options={fieldsStates[index].firstPart}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.statment")}
                      defaultValue={firstPartDefultValue[index].defultValue}
                      disabled={firstPartDefultValue[index].isDisabled}
                      onChange={(event, value) => {
                        handleFormChange(index, event, 3, value);
                      }}
                    />
                  </div>
                  <div>
                    <label style={clasess.inputLable}>
                      {t("properties.condtion")}
                    </label>
                    <GoMakeAutoComplate
                      options={conditions}
                      style={clasess.dropDownListContainer}
                      placeholder={t("properties.condtion")}
                      value={field.condition}
                      onChange={(event, value) => {
                        handleFormChange(index, event, 4, value);
                      }}
                    />
                  </div>
                  <div>
                    <label style={clasess.inputLable}>
                      {t("properties.statment")}
                    </label>

                    {secondPartTypeState[index].isInputField && (
                      <GomakeTextInput
                        style={clasess.textInputStyle}
                        placeholder={t("properties.statment")}
                        value={field.secondPart}
                        onChange={(event, value) => {
                          handleNumberField(index, event, 5, value);
                        }}
                      />
                    )}
                    {!secondPartTypeState[index].isInputField && (
                      <GoMakeAutoComplate
                        options={fieldsStates[index].secondPart}
                        style={clasess.dropDownListContainer}
                        placeholder={t("properties.statment")}
                        value={field.secondPart}
                        onChange={(event, value) => {
                          handleFormChange(index, event, 5, value);
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={removeFields}
                  >
                    <DeleteMenuIcon />
                  </div>
                </div>
              </div>
            );
          })}
        </form>
        <div style={clasess.AddNewRuleDiv}>
          <AddPlusIcon />{" "}
          <span onClick={addFields} style={clasess.spanAddNewRule}>
            {t("properties.addNewRule")}
          </span>
        </div>

        <div style={clasess.valueContainer}>
          <div style={clasess.inputLable}>
            {t("products.profits.exceptions.selectScopeOfChange")}
          </div>
          <GoMakeAutoComplate
            options={[
              { label: "Additional", value: 0 },
              { label: "NewBase", value: 1 },
              { label: "EditBase", value: 2 },
            ]}
            placeholder={t("products.profits.exceptions.selectScopeOfChange")}
            // onChange={(e: any, item: any) => {
            //   profitsStateValue?.onChangeState("additionalProfit", null);
            //   profitsStateValue?.onChangeState(
            //     "exceptionType",
            //     item?.value
            //   );
            // }}
            style={{
              border: "0px",
              background: "#fff",
              borderRadius: 4,
            }}
          />
        </div>

        {/* <div style={clasess.valueContainer}>
          <label style={clasess.inputLable}>value</label>
          <GomakeTextInput
            style={clasess.textInputStyle}
            placeholder="value"
            value={value}
            onChange={(event, value) => {
              handleNumberField(0, event, 6, value);
            }}
          />
        </div> */}
        {/* <div style={clasess.btnContainer}>
          <GomakePrimaryButton
            style={clasess.sendBtn}
            onClick={() => {
              create();
            }}
          >
            {t("properties.create")}
          </GomakePrimaryButton>
        </div>
        <div>
          <div>
            <label
              style={{
                ...FONT_FAMILY.Lexend(500, 12),
                // color: primaryColor(500),
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              Terminal
            </label>
            <textarea
              disabled={true}
              style={clasess.textarea}
              placeholder="Your rules will viewed here . . ."
              value={expression}
            />
          </div>
        </div> */}
      </GoMakeModal>
    </>
  );
};

export { AddRuleModal };
