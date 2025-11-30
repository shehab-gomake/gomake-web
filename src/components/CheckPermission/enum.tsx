import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

export enum Permissions {
  SHOW_CLIENT_BALANCE = "ShowClientBalance",
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
  SHOW_COSTS_IN_QUOTES = "IsShowCostsInQuotes",
  UPDATE_QUOTE_ITEM_PRICES = "EditPriceQuote",
  DELETE_QUOTE_ITEM = "DeleteQuoteItem",
  UPDATE_QUOTE_ITEM = "UpdateQuoteItem",
  UPDATE_QUOTE_DISCOUNT = "UpdateQuoteDiscount",
  UPDATE_QUOTE_DELIVERY_ITEM_PRICES = "UpdateQuoteDeliveryItemPrices",
  SHOW_COSTS_IN_CALCULATIONS = "ShowCostsInCalculations",
  ADD_NEW_PRODUCT_FROM_CART = "AddNewProductFromTheCart",
  CAN_SELECT_CLIENT_IN_HOME_PAGE = "CanSelectClientInHomePage",
  IS_CAN_CREATE_NEW_TEMPLATE = "IsCanCreateNewTemplate",
  SHOW_URGENT_ORDER_CHECKBOX = "ShowUrgentOrderCheckBox",
  SHOW_GOMAKE_AI = "ShowGoMakeAI",
  //SHOW_PROFITS_IN_CALCULATIONS = "ShowProfitsInCalculations",
  CUSTOMIZE_WORKFLOW = "CustomizeWorkflow",
  SHOW_QUOTE_STATISTICS = "ShowQuotesStatistics",
  UPDATE_CALCULATED_PRICE = "UpdateCalculatedPrice",
  SHOW_PRICING_TAB = "ShowPricingTab",

  //Materials group
  EDIT_MATERIAL = "EditMaterial",
  SHOW_MATERIALS = "Show Material",

  //machines group
  SHOW_MACHINES = "ShowMachines",
  ADD_MACHINE = "AddMachine",
  EDIT_MACHINE = "EditMachines",
  SHOW_ACTION_AND_MATERIAL_IN_MACHINE = "ShowActionAndMaterialInMachines",

  //Actions group
  SHOW_ACTIONS = "ShowActions",
  SHOW_PROPERTIES = "ShowProperties",
  SHOW_PROFITS = "ShowProfit",
  EDIT_PROFITS = "EditProfitInActions",
  EDIT_PROPERTIES = "EditPropertiesInActions",
  CAN_UPDATE_MACHINES_IN_WORK_FLOW_ACTION = "CanUpdateMachinesInWorkFloeAction",
  CAN_UPDATE_EMPLOYEES_IN_WORK_FLOW_ACTION = "CanUpdateEmployyesInWorkFloeAction",
  //settings group
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
  SHOW_SHIPMENT_TYPES = "ShowShipmentTypes",
  SHOW_PRICING_PROFILE = "ShowPricingProfile",
  SHOW_PREFERENCES = "ShowPreferences",
  ADD_WORK_FLOW_TO_PRODUCT = "AddWorkFlowToProduct",
  ADD_HOT_FOLDER_TO_PRODUCT = "AddHotFolderToProduct",
  SHOW_CPA_CODE = "showCpaCode",
  SHOW_GROUPS = "showGroups",
  SHOW_FRONT_DESK = "ShowFrontDesk",

  //orders group
  SHOW_ORDERS = "ShowOrders",
  SHOW_COSTS_IN_ORDERS = "IsShowCostsInOrders",
  EDIT_ORDERS = "EditOrders",
  EDIT_PURCHASE_ORDERS = "EditPurchaseOrders",
  DELETE_ORDER_ITEM = "DeleteOrderItem",
  DELETE_PURCHASE_ORDER_ITEM = "DeletePurchaseOrderItem",
  UPDATE_ORDER_DELIVERY_ITEM_PRICES = "UpdateOrderDeliveryItemPrices",
  UPDATE_ORDER_ITEM_PRICES = "UpdateOrderItemPrices",
  UPDATE_PURCHASE_ORDER_ITEM_PRICES = "UpdatePurchaseOrderItemPrices",
  UPDATE_ORDER_ITEM = "UpdateOrderItem",
  UPDATE_PURCHASE_ORDER_ITEM = "UpdatePurchaseOrderItem",
  UPDATE_ORDER_DISCOUNT = "UpdateOrderDiscount",
  UPDATE_PURCHASE_ORDER_DISCOUNT = "UpdatePurchaseOrderDiscount",
  SEND_PAYMENT_TO_CLIENT = "SendPaymentToClient",
  UPDATE_DELIVERY_STATUS = "UpdateDeliveryStatus",

  //production floor group
  SHOW_PRODUCTION_FLOOR = "ShowProductionFloor",
  EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR = "EditBoardMissionInProductionFloor",
  SHOW_COSTS_IN_PRODUCTION_FLOOR = "IsShowCostsInProductionFloor",
  IS_CAN_UPDATE_MACHINE_IN_PRODUCTION_FLOOR = "IsCanUpdateMachineInProductionFloor",
  SHOW_EMPLOYEE_WORKING_HOURS = "ShowEmployeeWorkingHours",
  SHOW_PRODUCTION_TIME_LINE = "ShowProductionTimeLine",
  IS_CAN_SHARE_GROUP = "IsCanShareGroup",
  SHOW_ALL_STUCK_JOBS_ANAYTICS = "ShowAllStuckJobsAnaytics",

  //board missions group
  SHOW_BOARD_MISSIONS = "IsCanShowBoardMissions",
  SHOW_COSTS_IN_BOARD_MISSIONS = "IsShowCostsInBoardMissions",
  ALLOW_PRINT_PACKAGING_SLIP_BEFORE_READY = "AllowPrintPackagingSlipBeforeReady",

  //administration group
  SHOW_ADMINISTRATION_PERMISSIONS = "ShowAdministrationPermissions",
  MACHINES_ADMIN = "MachinesAdmin",
  MATERIALS_ADMIN = "MaterialAdmin",
  TRANSLATION_ADMIN = "TranslationAdmin",
  SHOW_PRINTHOUSES_TABLE = "ShowPrintHousesTable",
  SHOW_ADMIN_CUSTOMER_SERVICE = "ShowAdminCustomerService",

  //sales group
  SHOW_DELIVERY_NOTES = "ShowDeliveryNotes",
  SHOW_DELIVERY_NOTES_REFUND = "ShowDeliveryNotesRefund",
  SHOW_INVOICES = "ShowInvoices",
  SHOW_INVOICES_REFUND = "ShowInvoicesRefund",
  SHOW_ERP_DOCUMENTS_TABLE_SUMMERY = "ShowErpDocumentsTableSummery",
  // ADD_NEW_PRODUCT_FROM_CART = "AddNewProductFromTheCart",
  CAN_CLOSE_MANUALLY = "CanCloseManually",
  SHOW_DELIVERIES = "ShowDeliveries",
  CAN_OPEN_CLOSED_DOCUMENTS = "CanOpenClosedDocuments",
  SHOW_SALES_DASHBOARD = "ShowSalesDashboard",
  UPDATE_DOCUMENT_AGENT = "UpdateDocumentAgent",
  //purchase group
  SHOW_PURCHASE_ORDERS = "ShowPurchaseOrders",
  SHOW_PURCHASE_INVOICES = "ShowPurchaseInvoices",
  SHOW_PURCHASE_INVOICES_REFUND = "ShowPurchaseInvoicesRefund",

  //banking group
  SHOW_RECEIPTS = "ShowReceipts",
  SHOW_DEPOSITS = "ShowDeposits",
  SHOW_SUPPLIER_PAYMENTS = "ShowSupplierPayments",
  CANCEL_RECEIPT = "CancelReceipt",

  //reports group
  SHOW_REPORTS = "ShowReports",
  SHOW_AGING_REPORT = "ShowAgingReport",
  SHOW_LEDGER_REPORT = "ShowLedgerReport",
  SHOW_TRANSACTION_JOURNAL_REPORT = "ShowTransactionJournalReport",
  SHOW_DAILY_PAYMENT_REPORT = "ShowDailyPaymentsReport",
  SHOW_SALES_REPORT = "ShowSalesReport",
  SHOW_CREDIT_CARD_TRANSACTIONS = "ShowCreditCardTransactions",
  SHOW_VAT_REPORT = "ShowVatReport",
  SHOW_ACCOUNTING_TRANSACTION_REPORT = "ShowAccountingTransactionReport",
  SHOW_ADJUSTMENTS_REPORT = "ShowAdjustmentsReport",
  SHOW_HOME_PAGE_STATISTICS = "ShowHomePageStatistics",
  SHOW_LOGS = "ShowLogs",
  GENERATE_REPORT = "GenerateReport",
  SHOW_SUPPLIER_AGING_REPORT = "ShowSupplierAgingReport",
  SHOW_SUPPLIER_LEDGER_REPORT = "ShowSupplierLedgerReport",
  SHOW_SUPPLIER_PAYMENT_REPORT = "ShowSupplierPaymentsReport",
  SHOW_PURCHASES_REPORT = "ShowPurchasesReport",
  SHOW_MAILING_LOGS = "ShowMailingLogs",
}

export const DocumentPermission = {
  EDIT_DOCUMENT: "EditDocument",
  DELETE_DOCUMENT_ITEM: "DeleteDocumentItem",
  UPDATE_DOCUMENT_ITEM: "UpdateDocumentItem",
  UPDATE_DOCUMENT_DISCOUNT: "UpdateDocumentDiscount",
  UPDATE_DOCUMENT_ITEM_PRICES: "UpdateDocumentItemPrices",
  UPDATE_DOCUMENT_DELIVERY_ITEM_PRICES: "UpdateDocumentDeliveryItemPrices",
};

export const documentPermissionMap = {
  [DocumentPermission.EDIT_DOCUMENT]: {
    [DOCUMENT_TYPE.quote]: Permissions.EDIT_QUOTES,
    [DOCUMENT_TYPE.order]: Permissions.EDIT_ORDERS,
    [DOCUMENT_TYPE.purchaseOrder]: Permissions.EDIT_PURCHASE_ORDERS,
  },
  [DocumentPermission.DELETE_DOCUMENT_ITEM]: {
    [DOCUMENT_TYPE.quote]: Permissions.DELETE_QUOTE_ITEM,
    [DOCUMENT_TYPE.order]: Permissions.DELETE_ORDER_ITEM,
    [DOCUMENT_TYPE.purchaseOrder]: Permissions.DELETE_PURCHASE_ORDER_ITEM,
  },
  [DocumentPermission.UPDATE_DOCUMENT_ITEM]: {
    [DOCUMENT_TYPE.quote]: Permissions.UPDATE_QUOTE_ITEM,
    [DOCUMENT_TYPE.order]: Permissions.UPDATE_ORDER_ITEM,
    [DOCUMENT_TYPE.purchaseOrder]: Permissions.UPDATE_PURCHASE_ORDER_ITEM,
  },
  [DocumentPermission.UPDATE_DOCUMENT_DISCOUNT]: {
    [DOCUMENT_TYPE.quote]: Permissions.UPDATE_QUOTE_DISCOUNT,
    [DOCUMENT_TYPE.order]: Permissions.UPDATE_ORDER_DISCOUNT,
    [DOCUMENT_TYPE.purchaseOrder]: Permissions.UPDATE_PURCHASE_ORDER_DISCOUNT,
  },
  [DocumentPermission.UPDATE_DOCUMENT_ITEM_PRICES]: {
    [DOCUMENT_TYPE.quote]: Permissions.UPDATE_QUOTE_ITEM_PRICES,
    [DOCUMENT_TYPE.order]: Permissions.UPDATE_ORDER_ITEM_PRICES,
    [DOCUMENT_TYPE.purchaseOrder]:
      Permissions.UPDATE_PURCHASE_ORDER_ITEM_PRICES,
  },
  [DocumentPermission.UPDATE_DOCUMENT_DELIVERY_ITEM_PRICES]: {
    [DOCUMENT_TYPE.quote]: Permissions.UPDATE_QUOTE_DELIVERY_ITEM_PRICES,
    [DOCUMENT_TYPE.order]: Permissions.UPDATE_ORDER_DELIVERY_ITEM_PRICES,
  },
};
