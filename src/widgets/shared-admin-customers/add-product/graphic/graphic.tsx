import { useAddProduct } from "@/hooks";
import { useStyle } from "./style";

const GraphicWidget = () => {
  const { classes } = useStyle();
  const {} = useAddProduct({ classes });

  return (
    <div>
      <div>coming soon</div>
    </div>
  );
};

export { GraphicWidget };
