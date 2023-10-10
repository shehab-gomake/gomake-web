import { useRecoilState } from "recoil";
import { documentDesignState, documentTypeState } from "../../state/documents-state";

const creationDocumetInputs = (state)  => {
    const [documentTypes, setdocumentTypes] = useRecoilState(documentTypeState);

    return [
        {
            name: "documentType",
            label: "documentingDesign.documnetCreation.docmentType",
            type: "select",
            placeholder: "documentingDesign.documnetCreation.docmentType",
            required: true,
            parameterKey: "docType",
            options: documentTypes,
            value: state?.docType,
            isValid: true,
        },
        {
            name: "agent",
            label: "customers.modal.agent",
            type: "select",
            placeholder: "customers.modal.agent",
            required: false,
            parameterKey: "agentId",
            options: [],
            optionsUrl: "/v1/employee/get-all-agents",
            value: state?.agentId,
            isValid: true,
        },
       
    ];

};
const TitleDefinitionInputs = (state)  => {
    return [
        {
            name: "Business name",
            label: "documentingDesign.TitleDefinition.BusinessName",
            type: "text",
            placeholder: "documentingDesign.TitleDefinition.BusinessName",
            required: false,
            parameterKey: "businessName",
            value: state?.businessName ? state.businessName : "",
            isValid: false,
        },
        {
            name: "H.P./authorizedDealer",
            label: "documentingDesign.TitleDefinition.H.P./authorizedDealer",
            type: "text",
            placeholder: "documentingDesign.TitleDefinition.H.P./authorizedDealer",
            required: false,
            parameterKey: "authorizedDealer",
            value: state?.authorizedDealer ? state.authorizedDealer : "",
            isValid: true,
        },
      
        
       
       
    ];

};
const TitleDefinitionCustomLogoInputs = (state)  => {
        return [
            {
                name: "Custom Logo",
                label: "documentingDesign.TitleDefinition.CustomLogo",
                type: "file",
                placeholder: "documentingDesign.TitleDefinition.CustomLogo",
                required: false,
                parameterKey: "pdfLogo",
                value: state?.pdfLogo,
                isValid: true,
            },
            {
                name: "Logo Upload",
                label:"documentingDesign.TitleDefinition.LogoUpload",
                type: "file",
                placeholder: "documentingDesign.TitleDefinition.LogoUpload",
                required: false,
                parameterKey: "pdfHeader",
                value: state?.pdfHeader,
                isValid: true,
            },
         
        ];
};
const TableSettingInputs = (state)  => {

    return [
    
        {
            name: "Table Header bg color",
            label: "documentingDesign.TableSetting.TableHeaderbgcolor",
            type: "color",
            placeholder: "documentingDesign.TableSetting.TableHeaderbgcolor",
            required: false,
            parameterKey: "pdfColor",
            value: state?.pdfColor ? state?.pdfColor : "",
            isValid: true,
        },
        {
            name: "Table text color",
            label: "documentingDesign.TableSetting.Tabletextcolor",
            type: "color",
            placeholder: "documentingDesign.TableSetting.Tabletextcolor",
            required: false,
            parameterKey: "pdfColorText",
            value: state?.pdfColorText ? state?.pdfColorText : "",
            isValid: true,
        },
        {
            name: "Vertical border color",
            label: "documentingDesign.TableSetting.Verticalbordercolor",
            type: "color",
            placeholder: "documentingDesign.TableSetting.Verticalbordercolor",
            required: false,
            parameterKey: "boarderVerticalColor",
            value: state?.boarderVerticalColor ? state?.boarderVerticalColor : "",
            isValid: true,
        },
        {
            name: "Horizonta Border Color",
            label: "documentingDesign.TableSetting.Horizontalbordercolor",
            type: "color",
            placeholder: "documentingDesign.TableSetting.Horizontalbordercolor",
            required: false,
            parameterKey: "boarderHorzintoalColor",
            value: state?.boarderHorzintoalColor ? state?.boarderHorzintoalColor : "",
            isValid: true,
        },
    ];
};
const TableSettingInputs2 = (state)  => {
    return [
    
        {
            name: "Placement of text",
            label: "documentingDesign.TableSetting.Placementoftext",
            type: "select",
            placeholder: "documentingDesign.TableSetting.Placementoftext",
            required: false,
            options: [],
            optionsUrl: "",
            parameterKey: "Placementoftext",
            value: state?.Placementoftext ? state?.Placementoftext : "",
            isValid: true,
        },
    
    ];
};
const AdditionalOptionsInputs = (state)  => {
    return [
    
        {
            name: "View salesperson",
            label: "documentingDesign.Additional.Viewsalesperson",
            type: "switch",
            placeholder: "documentingDesign.Additional.Viewsalesperson",
            required: false,
            parameterKey: "showAgentName",
            value: state?.showAgentName,
            isValid: true,
        },
        {
            name: "View doc producer",
            label: "documentingDesign.Additional.Viewdocproducer",
            type: "switch",
            placeholder: "documentingDesign.Additional.Viewdocproducer",
            required: false,
            parameterKey: "showDocProduserName",
            value: state?.showDocProduserName ? state?.showDocProduserName : "",
            isValid: true,
        },
        {
            name: "Show payment date",
            label: "documentingDesign.Additional.Showpaymentdate",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showpaymentdate",
            required: false,
            parameterKey: "ShowToPayUntil",
            value: state?.ShowToPayUntil ? state?.shShowToPayUntil : "",
            isValid: true,
        },
        {
            name: "Show customer type",
            label: "documentingDesign.Additional.Showcustomertype",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showcustomertype",
            required: false,
            parameterKey: "showClientType",
            value: state?.showClientType,
            isValid: true,
        },
        
       
            
            

    ];
};
const AdditionalOptionsInputs2 = (state)  => {
    return [
    
        {
            name: "Show customer code",
            label: "documentingDesign.Additional.Showcustomercode",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showcustomercode",
            required: false,
            parameterKey: "showClientCode",
            value: state?.showClientCode,
            isValid: true,
        },
        {
            name: "View customer balance",
            label: "documentingDesign.Additional.Viewcustomerbalance",
            type: "switch",
            placeholder: "documentingDesign.Additional.Viewcustomerbalance",
            required: false,
            parameterKey: "IsShowBalance",
            value: state?.IsShowBalance,
            isValid: true,
        },
        {
            name: "Show payment terms",
            label: "documentingDesign.Additional.Showpaymentterms",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showpaymentterms",
            required: false,
            parameterKey: "showPaymentTerms",
            value: state?.showPaymentTerms,
            isValid: true,
        },
        {
            name: "Show tax payable",
            label: "documentingDesign.Additional.Showtaxpayable",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showtaxpayable",
            required: false,
            parameterKey: "showWithholdingTaxPayable",
            value: state?.showWithholdingTaxPayable,
            isValid: true,
        },     

    ];
};


const FooterInputs1 = (state)  => {
    return [
    
        {
            name: "Email",
            label: "documentingDesign.Footer.Email",
            type: "text",
            placeholder: "documentingDesign.Footer.Email",
            required: false,
            parameterKey: "email",
            value: state?.email,
            isValid: true,
        },
        {
            name: "Phone",
            label: "documentingDesign.Footer.Phone",
            type: "text",
            placeholder: "documentingDesign.Footer.Phone",
            required: false,
            parameterKey: "mobileNumber",
            value: state?.mobileNumber,
            isValid: true,
        },
        {
            name: "Address",
            label: "documentingDesign.Footer.Address",
            type: "text",
            placeholder: "documentingDesign.Footer.Address",
            required: false,
            parameterKey: "address",
            value: state?.address,
            isValid: true,
        },
         

    ];
};
const FooterInputs2 = (state)  => {
    return [
    
        {
            name: "Footer Image",
            label: "documentingDesign.Footer.FooterImage",
            type: "file",
            placeholder: "documentingDesign.Footer.FooterImage",
            required: false,
            parameterKey: "pdfFooter",
            value: state?.pdfFooter,
            isValid: true,
        },
    ];
};

const QRCodesInputs1 = (state)  => {
    return [
    
   
        {
            name: "Display QR codes in a work order document",
            label: "documentingDesign.QRCodes.DisplayQRcodesinaworkorderdocument",
            type: "switch",
            placeholder: "documentingDesign.Additional.DisplayQRcodesinaworkorderdocument",
            required: false,
            parameterKey: "DisplayQRcodesinaworkorderdocument",
            value: state?.DisplayQRcodesinaworkorderdocument,
            isValid: true,
        },
        {
            name: "PDF production - QrCodes",
            label: "documentingDesign.QRCodes.PDFproductionQrCodes",
            type: "switch",
            placeholder: "documentingDesign.QRCodes.PDFproductionQrCodes",
            required: false,
            parameterKey: "PDFproductionQrCodes",
            value: state?.PDFproductionQrCodes,
            isValid: true,
        },
      
    ];
};
const QRCodesInputs2 = (state)=>{
    return [
   
        {
            name: "Display an initial QR Code for the entire order within the production PDF",
            label: "documentingDesign.QRCodes.DisplayaninitialQRCode",
            type: "switch",
            placeholder: "documentingDesign.QRCodes.DisplayaninitialQRCode",
            required: false,
            parameterKey: "DisplayaninitialQRCode",
            value: state?.DisplayaninitialQRCode,
            isValid: true,
        },   
        {
            name: "Show payment date",
            label: "documentingDesign.Additional.Showpaymentdate",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showpaymentdate",
            required: false,
            parameterKey: "Showpaymentdate",
            value: state?.Showpaymentdate,
            isValid: true,
        }, 
    ];

};

const QRCodesInputs3 = (state) =>{
    return [
        {
            name: "display all types with equal amounts in the PDF of the PACA",
            label: "documentingDesign.QRCodes.displayall",
            type: "switch",
            placeholder: "documentingDesign.QRCodes.displayall",
            required: false,
            parameterKey: "displayall",
            value: state?.displayall,
            isValid: true,
        }, 
        {
            name: "Show started and finished QRs in the production PDF",
            label: "documentingDesign.QRCodes.ShowStarted",
            type: "switch",
            placeholder: "documentingDesign.QRCodes.ShowStarted",
            required: false,
            parameterKey: "ShowStarted",
            value: state?.ShowStarted,
            isValid: true,
        },  
    ];
};


export {creationDocumetInputs ,
     TitleDefinitionInputs ,
     TitleDefinitionCustomLogoInputs,
     TableSettingInputs,
     TableSettingInputs2,
     AdditionalOptionsInputs,
     AdditionalOptionsInputs2,
     FooterInputs1,
     FooterInputs2,
     QRCodesInputs1,
     QRCodesInputs2,
     QRCodesInputs3
    };