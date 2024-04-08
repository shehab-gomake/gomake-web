export enum Permissions {
    
    // client group
    SHOW_CLIENT = "ShowClient",
    EDIT_CLIENT = "EditClient",
    ADD_CLIENT = "AddClient",

    //suppliers group
    SHOW_SUPPLIER = "ShowSupplier",
    EDIT_SUPPLIER = "EditSupplier",
    ADD_SUPPLIER = "AddSupplier",

    // quote group
    SHOW_QUOTES = "ShowQuotes",
    CREATE_QUOTES = "CreateQuote",
    EDIT_QUOTES = "EditQuotes",
    EDIT_QUOTE_PRICES = "EditPriceQuote",

    //Materials group
    EDIT_MATERIAL = "EditMaterial",
    SHOW_MATERIALS = "Show Material",

    //machines group
    SHOW_MACHINES = "ShowMachines",
    ADD_MACHINE = "AddMachine",
    EDIT_MACHINE = "EditMachines",

    //Actions group
    SHOW_ACTIONS = "ShowActions",
    SHOW_PROPERTIES = "ShowProperties",
    SHOW_PROFITS = "ShowProfit",
    EDIT_PROFITS = "EditProfitInActions",
    EDIT_PROPERTIES = "EditPropertiesInActions",

    //settings group
    SHOW_SETTINGS = "ShowSetting",
    SHOW_PROFILE_COMPANY = "ShowCompanyProfile",
    EDIT_COMPANY_PROFILE = "UpdateCompanyProfile",
    SHOW_PRODUCTS = "ShowProducts",
    ADD_PRODUCT = "AddProduct",
    EDIT_PRODUCT = "EditProduct",
    SHOW_MAILING_TEMPLATES = "ShowMailingTemplate",
    EDIT_MAILING_TEMPLATES = "EditMailingTemplate",
    SHOW_DOCUMENT_NUMBERING = "ShowDocumentNumbering",
    EDIT_DOCUMENT_NUMBERING = "EditDocumentNumbering",
    SHOW_DOCUMENT_DESIGN = "ShowDocumentDesign",
    EDIT_DOCUMENT_DESIGN = "EditDocumentDesign",
    SHOW_EMPLOYEES = "ShowEmployees",
    ADD_EMPLOYEE = "AddEmployee",
    EDIT_EMPLOYEE = "EditEmployee",
    ADD_ROLE = "AddRole",
    EDIT_ROLE = "EditRole",
    SHOW_PERMISSIONS = "ShowPermissions",
    SHOW_FINANCE = "ShowFinance",

    //orders group    
    SHOW_ORDERS = "ShowOrders",
    EDIT_ORDERS = "EditOrders",

    //production floor group
    SHOW_PRODUCTION_FLOOR = "ShowProductionFloor",
    EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR = "EditBoardMissionInProductionFloor",

    //administration group
    SHOW_ADMINISTRATION_PERMISSIONS = "ShowAdministrationPermissions",
    MACHINES_ADMIN = "MachinesAdmin",
    MATERIALS_ADMIN = "MaterialAdmin",
    TRANSLATION_ADMIN = "TranslationAdmin",
    SHOW_PRINTHOUSES_TABLE = "ShowPrintHousesTable",

    //sales group
    SHOW_BOARD_MISSIONS = "ShowBoardMissions",
    SHOW_DELIVERY_NOTES = "ShowDeliveryNotes",
    SHOW_DELIVERY_NOTES_REFUND = "ShowDeliveryNotesRefund",
    SHOW_INVOICES = "ShowInvoices",
    SHOW_INVOICES_REFUND = "ShowInvoicesRefund",

    //purchase group
    SHOW_PURCHASE_ORDERS = "ShowPurchaseOrders",
    SHOW_PURCHASE_INVOICES = "ShowPurchaseInvoices",
    SHOW_PURCHASE_INVOICES_REFUND = "ShowPurchaseInvoicesRefund",

    //banking group
    SHOW_RECEIPTS = "ShowReceipts",
    SHOW_DEPOSITS = "ShowDeposits",

    //reports groupS
    SHOW_REPORTS="ShowReports",
    SHOW_AGING_REPORT = "ShowAgingReport",
    SHOW_LEDGER_REPORT = "ShowLedgerReport",
    SHOW_TRANSACTION_JOURNAL_REPORT = "ShowTransactionJournalReport",
    SHOW_DAILY_PAYMENT_REPORT = "ShowDailyPaymentsReport",
    SHOW_SALES_REPORT = "ShowSalesReport",
    SHOW_CREDIT_CARD_TRANSACTIONS = "ShowCreditCardTransactions",
    SHOW_COMPANY_REPORTS="ShowCompanyReports"
}

