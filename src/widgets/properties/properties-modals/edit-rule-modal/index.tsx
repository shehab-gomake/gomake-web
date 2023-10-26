import { useTranslation } from "react-i18next";
import {
    GoMakeModal,
    GomakePrimaryButton,
    GomakeTextInput,
} from "@/components";

import { useStyle } from "./style";
import { useRecoilState, useRecoilValue } from "recoil";
import { propertyState } from "../../property";
import { use, useEffect, useState } from "react";
import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { useRule } from "../../hooks/use-rule";
import { AddIcon } from "@/icons/add-icon";
import { addRuleState } from "@/store/add-rule";


const EditRulesModal = ({ openModal, onClose, actionRules, actionId, propertyId, ruleType }) => {

    const { t } = useTranslation();
    const { clasess } = useStyle();
    const propertyStateValue = useRecoilValue<any>(propertyState);
    const [isOpen, setIsOpen] = useState<boolean>(openModal);
    const [rules, setRules] = useState<any>(actionRules || {});
    const [openAddNewRule, setOpenNewRule] = useRecoilState<boolean>(addRuleState);
    const { deleteRule } = useRule();
    const onCloseNewRuleModal = () => {
        setOpenNewRule(false)
    }
    const deletePropertyRule = async (ruleId: string) => {
        try {
            debugger
            await deleteRule(actionId, propertyId, ruleType, ruleId)
        } catch (error) {

        }
    }
    const onOpenNewRuleModal = () => {
        setOpenNewRule(true)
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
                <div style={{overflow: 'scroll',height: '300px'}}>
                    <div style={{ width: "100%", marginTop: 10 }}>
                        
                        {Array.isArray(rules) && rules.map((rule, index) => {
                            return (<>
                                <div className="scrollBlue" style={clasess.lineStyle}>
                                    {rule.expression}
                                    <div onClick={() => { deletePropertyRule(rule.id) }} style={clasess.deleteBtn}>
                                        <DeleteMenuIcon />
                                    </div>
                                </div>

                            </>
                            )
                        })}
                    </div>

                  
                </div>
                <div style={clasess.addBtnStyle}>
                        <GomakePrimaryButton onClick={onOpenNewRuleModal} 
                            style={clasess.btnStyle}


                        > {t("properties.addRule")}
                        </GomakePrimaryButton>
                    </div>

            </GoMakeModal>
        </>
    );
};
export { EditRulesModal };
