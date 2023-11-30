import { ProfitRightSideWidget } from "./widgets/profit-right-side/profit-right-side";
import { ProfitLeftSideWidget } from "./widgets/profit-left-side/profit-left-side";
import { ProfitHeaderWidget } from "./widgets/profit-header/profit-header";
import { useNewProfits } from "./use-profits";
import { useStyle } from "./style";

const ProfitsNewPageWidget = () => {
  const { clasess } = useStyle();
  const { router } = useNewProfits();

  return (
    <div style={clasess.mainGridContainer}>
      {router.query.quoteId && (
        <header>
          <ProfitHeaderWidget />
        </header>
      )}
      <div style={clasess.bodyGridContainer}>
        <ProfitLeftSideWidget />
        <ProfitRightSideWidget />
      </div>
    </div>
  );
};

export { ProfitsNewPageWidget };
