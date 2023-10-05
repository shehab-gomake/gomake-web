
export interface IDocumentDesign {
        agentId?:  string,
        docType?: string,
        address?:string,
        boarderHorzintoalColor?:string;
        boarderVerticalColor?:string;
        businessName:string | null;
        businessNumber:string | null;
        email?:string;
        footerState?:string;
        isShowBalance?:string;
        mobileNumber?:string;
        notes?:string;
        pdfColor?:string;
        pdfColorText?:string;
        pdfFooter?:string;
        pdfHeader?:string;
        previewUrl?:string;
        pdfLogo?:string;
        showAgentName?:string;
        showClientCode?:string;
        showClientType?:string;
        showDocProduserName?:string;
        showPaymentTerms?:string;
        showTitleInfo?:string;
        showToPayUntil?:string;
        showWithholdingTaxPayable?:string;
        textVerticalAligen?:string;
        recordID:string;

}
export interface IDocumentDesignProps {
    documentDesign : IDocumentDesign;
    setdocumentDesign?: (documentDesign : IDocumentDesign) => void;
}