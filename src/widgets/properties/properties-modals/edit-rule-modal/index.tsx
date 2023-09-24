import { useTranslation } from "react-i18next";
import {
    GoMakeModal,
    GomakePrimaryButton,
    GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { propertyState } from "../../property";
import { use, useEffect, useState } from "react";
import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { useRule } from "../../hooks/use-rule";


const EditRulesModal = ({ openModal, onClose, actionRules,actionId, propertyId, ruleType }) => {

    const { t } = useTranslation();
    const { clasess } = useStyle();
    const propertyStateValue = useRecoilValue<any>(propertyState);
    const [isOpen, setIsOpen] = useState<boolean>(openModal);
    const [rules, setRules] = useState<any>(actionRules || {});

    const {deleteRule} = useRule();

    const deletePropertyRule =async (ruleId: string) => {
        try{
            debugger
            await deleteRule(actionId, propertyId,ruleType,ruleId)
        }catch(error){

        }
    }
    useEffect(() => {
        setIsOpen(openModal)
    }, [openModal])

    useEffect(() => {
        setRules(actionRules || {})
    }, [actionRules])

    return (
        <>
            <GoMakeModal
                openModal={isOpen}
                modalTitle={t("properties.editRules")}
                onClose={() => { onClose() }}
                insideStyle={clasess.insideStyle}
            >
                <div>
                    <div style={{ width: "100%", marginTop: 10 }}>
                        {Array.isArray(rules) && rules.map((rule, index) => {
                            return (<>
                                <div className="scrollBlue" style={clasess.lineStyle}>
                                    {rule.expression}
                                    <div onClick={() => { deletePropertyRule(rule.id)}} style={clasess.deleteBtn}> 
                                        <DeleteMenuIcon  />
                                    </div>
                                </div>

                            </>
                            )
                        })}
                    </div>
                    <div style={clasess.btnContainer}>
                        <GomakePrimaryButton onClick={() => { onClose() }} style={clasess.cancelBtn}>
                            {t("properties.cancel")}
                        </GomakePrimaryButton>

                        <GomakePrimaryButton style={clasess.sendBtn}>
                            {t("properties.addRule")}
                        </GomakePrimaryButton>


                    </div>
                </div>
            </GoMakeModal>
        </>
    );
};
export { EditRulesModal };
