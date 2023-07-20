import { useAddProduct } from "@/pages/admin/products/add-product/use-add-product";
import { useStyle } from "./style";

export default function GraphicWidget() {
  const { clasess } = useStyle();
  const {} = useAddProduct();

  return (
    <div>
      <div>ddd</div>
    </div>
  );
}
