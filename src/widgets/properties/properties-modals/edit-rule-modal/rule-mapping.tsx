import { DeleteMenuIcon } from "@/pages/admin/products/parameters/widget/more-circle/icons/delete-menu";
import { ReOrderIcon } from "@/icons";

import { useStyle } from "./style";

const RuleMappingWidget = ({ rule, deletePropertyRule }) => {
  const { clasess } = useStyle();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 8,
      }}
    >
      <div>
        <ReOrderIcon />
      </div>

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
    </div>
  );
};
export { RuleMappingWidget };
