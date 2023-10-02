
const creationDocumetInputs = (state)  => {
    return [
        {
            name: "documentType",
            label: "documentingDesign.documnetCreation.docmentType",
            type: "select",
            placeholder: "documentingDesign.documnetCreation.docmentType",
            required: true,
            parameterKey: "docmentId",
            options: [],
            optionsUrl: "",
            value: state?.documentType,
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
            parameterKey: "BusinessName",
            value: state?.BusinessName,
            isValid: true,
        },
        {
            name: "H.P./authorizedDealer",
            label: "documentingDesign.TitleDefinition.H.P./authorizedDealer",
            type: "text",
            placeholder: "documentingDesign.TitleDefinition.H.P./authorizedDealer",
            required: false,
            parameterKey: "H.P./authorizedDealer",
            value: state?.authorizedDealer,
            isValid: true,
        },
        {
            name: "Logo Upload",
            type: "file",
            placeholder: "documentingDesign.TitleDefinition.LogoUpload",
            required: false,
            parameterKey: "LogoUpload",
            value: state?.authorizedDealer,
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
                parameterKey: "CustomLogo",
                value: state?.CustomLogo,
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
            parameterKey: "TableHeaderbgcolor",
            value: state?.TableHeaderbgcolor,
            isValid: true,
        },
        {
            name: "Table text color",
            label: "documentingDesign.TableSetting.Tabletextcolor",
            type: "color",
            placeholder: "documentingDesign.TableSetting.Tabletextcolor",
            required: false,
            parameterKey: "Tabletextcolor",
            value: state?.Tabletextcolor,
            isValid: true,
        },
        {
            name: "Vertical border color",
            label: "documentingDesign.TableSetting.Verticalbordercolor",
            type: "color",
            placeholder: "documentingDesign.TableSetting.Verticalbordercolor",
            required: false,
            parameterKey: "Verticalbordercolor",
            value: state?.Verticalbordercolor,
            isValid: true,
        },
        {
            name: "Horizonta Border Color",
            label: "documentingDesign.TableSetting.Horizontalbordercolor",
            type: "color",
            placeholder: "documentingDesign.TableSetting.Horizontalbordercolor",
            required: false,
            parameterKey: "Horizontalbordercolor",
            value: state?.Horizontalbordercolor,
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
            value: state?.Placementoftext,
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
            parameterKey: "Viewsalesperson",
            value: state?.Viewsalesperson,
            isValid: true,
        },
        {
            name: "View doc producer",
            label: "documentingDesign.Additional.Viewdocproducer",
            type: "switch",
            placeholder: "documentingDesign.Additional.Viewdocproducer",
            required: false,
            parameterKey: "Viewdocproducer",
            value: state?.Viewdocproducer,
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
        {
            name: "Show customer type",
            label: "documentingDesign.Additional.Showcustomertype",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showcustomertype",
            required: false,
            parameterKey: "Showcustomertype",
            value: state?.Showcustomertype,
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
            parameterKey: "Showcustomercode",
            value: state?.Showcustomercode,
            isValid: true,
        },
        {
            name: "View customer balance",
            label: "documentingDesign.Additional.Viewcustomerbalance",
            type: "switch",
            placeholder: "documentingDesign.Additional.Viewcustomerbalance",
            required: false,
            parameterKey: "Viewcustomerbalance",
            value: state?.Viewcustomerbalance,
            isValid: true,
        },
        {
            name: "Show payment terms",
            label: "documentingDesign.Additional.Showpaymentterms",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showpaymentterms",
            required: false,
            parameterKey: "Showpaymentterms",
            value: state?.Showpaymentterms,
            isValid: true,
        },
        {
            name: "Show tax payable",
            label: "documentingDesign.Additional.Showtaxpayable",
            type: "switch",
            placeholder: "documentingDesign.Additional.Showtaxpayable",
            required: false,
            parameterKey: "Showtaxpayable",
            value: state?.Showtaxpayable,
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
            parameterKey: "Email",
            value: state?.Email,
            isValid: true,
        },
        {
            name: "Phone",
            label: "documentingDesign.Footer.Phone",
            type: "text",
            placeholder: "documentingDesign.Footer.Phone",
            required: false,
            parameterKey: "Phone",
            value: state?.Phone,
            isValid: true,
        },
        {
            name: "Address",
            label: "documentingDesign.Footer.Address",
            type: "text",
            placeholder: "documentingDesign.Footer.Address",
            required: false,
            parameterKey: "Address",
            value: state?.Address,
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
            parameterKey: "FooterImage",
            value: state?.FooterImage,
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