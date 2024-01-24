import {IWorkFlowMonial} from "@/pages-components/products/digital-offset-price/interfaces/WorkFlowMonial";
import {IExceptionsLog} from "@/widgets/product-pricing-widget/interface";

export interface ICalculationSignalRResult {
    productItemValueDraftId:string;
    productItemValue?:any;
    monials?:IWorkFlowMonial[];
    exceptions?:IExceptionsLog[]
}