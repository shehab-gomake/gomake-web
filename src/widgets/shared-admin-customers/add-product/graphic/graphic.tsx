import { useAddProduct } from "@/hooks";
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
