export  enum Permissions {
    // client group
    SHOW_CLIENT = "ShowClient",
    EDIT_CLIENT="EditClient",
    ADD_CLIENT = "AddClient",
    
    //suppliers group
    SHOW_SUPPLIER="ShowSupplier",
    EDIT_SUPPLIER="EditSupplier",
    ADD_SUPPLIER = "AddSupplier",
    
    // quote group
    SHOW_QUOTES="ShowQuotes",
    CREATE_QUOTES = "CreateQuote",
    EDIT_QUOTES = "EditQuotes",
    EDIT_QUOTE_PRICES = "EditPriceQuote",
   
    //Materials group
    EDIT_MATERIAL="EditMaterial",
    SHOW_MATERIALS="Show Material",

    //machines group
    SHOW_MACHINES="ShowMachines",
    ADD_MACHINE="AddMachine",
    EDIT_MACHINE="EditMachines",
    
    //Actions group
    SHOW_ACTIONS="ShowActions",
    SHOW_PROPERTIES ="ShowProperties",
    SHOW_PROFITS ="ShowProfit",
    EDIT_PROFITS = "EditProfitInActions",
    EDIT_PROPERTIES ="EditPropertiesInActions",
    
    //settings group
    SHOW_SETTINGS = "ShowSetting",
    SHOW_PROFILE_COMPANY="ShowCompanyProfile",
    EDIT_COMPANY_PROFILE="UpdateCompanyProfile",
    SHOW_PRODUCTS = "ShowProducts",
    ADD_PRODUCT = "AddProduct",
    EDIT_PRODUCT="EditProduct",
    SHOW_MAILING_TEMPLATES = "ShowMailingTemplate",
    EDIT_MAILING_TEMPLATES = "EditMailingTemplate",
    SHOW_DOCUMENT_NUMBERING = "ShowDocumentNumbering",
    EDIT_DOCUMENT_NUMBERING = "EditDocumentNumbering",
    SHOW_DOCUMENT_DESIGN ="ShowDocumentDesign",
    EDIT_DOCUMENT_DESIGN ="EditDocumentDesign",
    SHOW_EMPLOYEES = "ShowEmployees",
    ADD_EMPLOYEE="AddEmployee",
    EDIT_EMPLOYEE="EditEmployee",
    ADD_ROLE="AddRole",
    EDIT_ROLE ="EditRole",
    SHOW_PERMISSIONS="ShowPermissions",

    //orders group    
    SHOW_ORDERS="ShowOrders",
    EDIT_ORDERS = "EditOrders",
   
    //production floor group
    SHOW_PRODUCTION_FLOOR = "ShowProductionFloor",
    EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR = "EditBoardMissionInProductionFloor",
    
    //administration group
    SHOW_ADMINISTRATION_PERMISSIONS = "ShowAdministrationPermissions",
    MACHINES_ADMIN = "MachinesAdmin",
    MATERIALS_ADMIN = "MaterialAdmin",
    TRANSLATION_ADMIN = "TranslationAdmin",
}

