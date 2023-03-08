import { ComponentName } from "@/components";
import { changeLanguage } from "i18next";
import { useStyle } from "./style";

const WidgetName = () => {
  const { clasess } = useStyle();

  return (
    <div style={clasess.container}>
      <div>
        <div onClick={() => changeLanguage("ar")}>Arabic</div>
        <div onClick={() => changeLanguage("en")}>English</div>
        <div onClick={() => changeLanguage("he")}>Hebrow</div>
      </div>
      <ComponentName text="Hey mohanad" />
      <ComponentName text="Hey faraj" />
      <ComponentName text="Hey faraj" />
    </div>
  );
};
export { WidgetName };
