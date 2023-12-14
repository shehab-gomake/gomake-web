import {useStationsViews} from "@/widgets/board-mission-widget/hooks/use-stations-views";
import {PricingWidget} from "@/widgets/product-pricing-widget/pricing-widget";

const StationsViewComponent = () => {
    const {getOutSourcingSuppliers, actions, workflows} = useStationsViews();
    return (
        <PricingWidget actions={actions} workFlows={workflows} getOutSourcingSuppliers={getOutSourcingSuppliers}/>
    );
}

export {StationsViewComponent}