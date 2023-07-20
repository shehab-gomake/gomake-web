import { useAddProduct } from "@/pages/admin/products/add-product/use-add-product";
import { useStyle } from "./style";

const GraphicWidget = () => {
  const { clasess } = useStyle();
  const {} = useAddProduct();

  return (
    <div>
      <div>ddd</div>
    </div>
  );
};

export { GraphicWidget };
