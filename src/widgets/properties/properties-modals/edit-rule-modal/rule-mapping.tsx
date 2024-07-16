import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { ReOrderIcon } from "@/icons";
import { useStyle } from "./style";
import { SettingIcon } from "@/widgets/shared-admin-customers";
import { EProductProfites } from "@/widgets/shared-admin-customers/add-product/settings/settings-data";

interface RuleMappingWidgetProps {
  rule: any;
  deletePropertyRule: (id: string) => void;
  productId?: string;
}

const RuleMappingWidget = ({ rule, deletePropertyRule, productId }: RuleMappingWidgetProps) => {
  const { clasess } = useStyle();

  return (
    <div style={clasess.mainContainerStyle}>
      <div>
        <ReOrderIcon />
      </div>
      <div style={clasess.lineStyle}>
        <div>
          {rule.expression} <span>value= {rule.successEvent}</span>
        </div>
        <div style={clasess.iconsContainer}>
          {(rule?.profitsModel === EProductProfites.BY_PRODUCT) && (
            <div
              style={clasess.deleteBtn}
              onClick={() => window.open(
                `/products/profits?productId=${productId}`,
                "_blank"
              )}
            ><SettingIcon width={"16"} height={"16"} />
            </div>
          )}
          <div
            style={clasess.deleteBtn}
            onClick={() => {
              deletePropertyRule(rule.id);
            }}
          > <DeleteMenuIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
export { RuleMappingWidget };
