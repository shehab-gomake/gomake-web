import { useStyle } from "./style";
import { useAgingReport } from "./use-aging-report";
import { AgingReportHeaderWidget } from "./widgets/header-widget";

const AgingReportWidget = () => {
  const { clasess } = useStyle();
  const { } = useAgingReport()
  return (
    <div style={clasess.mainContainer}>
      <AgingReportHeaderWidget />
    </div>
  );
};

export { AgingReportWidget };
