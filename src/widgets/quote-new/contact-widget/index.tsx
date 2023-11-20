import { useBusinessNeWidget } from "./use-business-widget";
import { useStyle } from "./style";

const ContactNewWidget = ({ values, getQuote }) => {
  const { clasess } = useStyle();
  const { t } = useBusinessNeWidget({ getQuote });
  return (
    <>
      <div style={clasess.businessContainerStyle}>gfffdfd</div>
    </>
  );
};

export { ContactNewWidget };
