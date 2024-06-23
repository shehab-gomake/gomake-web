
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
        pdfColor?:string | null;
        pdfColorText?:string | null;
        pdfFooter?:string | null;
        pdfHeader?:string | null;
        previewUrl?:string;
        pdfLogo?:string | null;
        showAgentName?:boolean;
        showClientCode?:string;
        showClientType?:string;
        showDocProduserName?:string;
        showPaymentTerms?:string;
        showTitleInfo?:string;
        showToPayUntil?:string;
        showWithholdingTaxPayable?:string;
        textVerticalAligen?:string | null;
        recordID:string;

}
export interface DocumentType {
    value:string;
    text:string;
}

export interface IDocumentDesignProps {
    documentDesign : IDocumentDesign;
    setdocumentDesign?: (documentDesign : IDocumentDesign) => void;
}