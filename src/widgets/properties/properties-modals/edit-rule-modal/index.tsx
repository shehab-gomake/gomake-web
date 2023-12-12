import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { useState } from "react";
import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { useRule } from "../../hooks/use-rule";

const EditRulesModal = ({
  openModal,
  onClose,
  selectedProperties,
  actionId,
  onOpenAddRuleModal,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [rules, setRules] = useState<any>();

  const { deleteRule } = useRule();

  const deletePropertyRule = async (ruleId: string) => {
    try {
      debugger;
      await deleteRule(
        actionId,
        selectedProperties?.propertyId,
        selectedProperties?.ruleType,
        ruleId
      );
    } catch (error) {}
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("properties.editRules")}
        onClose={() => {
          onClose();
        }}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <div
            style={{
              width: "100%",
              height: 245,
            }}
          >
            {Array.isArray(rules) &&
              rules.map((rule, index) => {
                return (
                  <>
                    <div style={clasess.lineStyle}>
                      {rule.expression}
                      <div
                        onClick={() => {
                          deletePropertyRule(rule.id);
                        }}
                        style={clasess.deleteBtn}
                      >
                        <DeleteMenuIcon />
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              onClick={() => {
                onClose();
              }}
              style={clasess.cancelBtn}
            >
              {t("properties.cancel")}
            </GomakePrimaryButton>

            <GomakePrimaryButton
              style={clasess.sendBtn}
              onClick={() => {
                onOpenAddRuleModal();
                onClose();
              }}
            >
              {t("properties.addRule")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { EditRulesModal };
