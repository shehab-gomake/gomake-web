import { GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTotalPriceAndVat } from "./use-total-price-and-vat";

const TotalPriceAndVatWidit = () => {
  const { clasess } = useStyle();
  const { btnTabs } = useTotalPriceAndVat();
  return (
    <div style={clasess.mainContainer}>
      <div style={clasess.leftSideContainer}>
        <GomakeTextInput
          multiline={6}
          style={clasess.textInputStyle}
          placeholder={"order comments"}
        />
        <div style={clasess.btnsContainer}>
          {btnTabs?.map((item) => {
            return <div style={clasess.btnStyle}>{item?.name}</div>;
          })}
        </div>
      </div>
      <div style={clasess.rightSideContainer}>3</div>
    </div>
  );
};
export { TotalPriceAndVatWidit };
