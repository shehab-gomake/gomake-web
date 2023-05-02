import { EnvelopeSizeInputs } from "../shared-inputs-widget/envelope-size-inputs";
import { useStyle } from "./style";

const EnvelopeSizeMapping = ({ index }) => {
  const { clasess } = useStyle();

  return (
    <>
      <div
        key={index}
        style={index & 1 ? clasess.tableSecondSections : clasess.tableSections}
      >
        <EnvelopeSizeInputs index={index} />
      </div>
    </>
  );
};
export { EnvelopeSizeMapping };
