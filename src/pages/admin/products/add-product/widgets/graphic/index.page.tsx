import { useStyle } from "./style";
import { useAddProduct } from "../../use-add-product";

export default function GraphicWidget() {
  const { clasess } = useStyle();
  const {} = useAddProduct();

  return (
    <div>
      <div>ddd</div>
    </div>
  );
}
