import { useAddProduct } from "@/hooks";
import { useStyle } from "./style";

const GraphicWidget = () => {
  const { clasess } = useStyle();
  const {} = useAddProduct({ clasess });

  return (
    <div>
      <div>coming soon</div>
    </div>
  );
};

export { GraphicWidget };
