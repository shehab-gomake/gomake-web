import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

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
  SHOW_COSTS_IN_QUOTES = "IsShowCostsInQuotes",
  UPDATE_QUOTE_ITEM_PRICES = "EditPriceQuote",
  DELETE_QUOTE_ITEM = "DeleteQuoteItem",
  UPDATE_QUOTE_ITEM = "UpdateQuoteItem",
  UPDATE_QUOTE_DISCOUNT = "UpdateQuoteDiscount",
  UPDATE_QUOTE_DELIVERY_ITEM_PRICES = "UpdateQuoteDeliveryItemPrices",

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

  //production floor group
  SHOW_PRODUCTION_FLOOR = "ShowProductionFloor",
  EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR = "EditBoardMissionInProductionFloor",
  SHOW_COSTS_IN_PRODUCTION_FLOOR = "IsShowCostsInProductionFloor",

  //board missions group
  SHOW_BOARD_MISSIONS = "IsCanShowBoardMissions",
  SHOW_COSTS_IN_BOARD_MISSIONS = "IsShowCostsInBoardMissions",

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

  //purchase group
  SHOW_PURCHASE_ORDERS = "ShowPurchaseOrders",
  SHOW_PURCHASE_INVOICES = "ShowPurchaseInvoices",
  SHOW_PURCHASE_INVOICES_REFUND = "ShowPurchaseInvoicesRefund",

  //banking group
  SHOW_RECEIPTS = "ShowReceipts",
  SHOW_DEPOSITS = "ShowDeposits",

  //reports group
  SHOW_REPORTS = "ShowReports",
  SHOW_AGING_REPORT = "ShowAgingReport",
  SHOW_LEDGER_REPORT = "ShowLedgerReport",
  SHOW_TRANSACTION_JOURNAL_REPORT = "ShowTransactionJournalReport",
  SHOW_DAILY_PAYMENT_REPORT = "ShowDailyPaymentsReport",
  SHOW_SALES_REPORT = "ShowSalesReport",
  SHOW_CREDIT_CARD_TRANSACTIONS = "ShowCreditCardTransactions",

  //calculation and production floor permissions
  SHOW_COSTS_IN_CALCULATIONS = "ShowCostsInCalculations",
  SHOW_PROFITS_IN_CALCULATIONS = "ShowProfitsInCalculations"
}


export const DocumentPermission = {
  EDIT_DOCUMENT: "EditDocument",
  DELETE_DOCUMENT_ITEM: "DeleteDocumentItem",
  UPDATE_DOCUMENT_ITEM: "UpdateDocumentItem",
  UPDATE_DOCUMENT_DISCOUNT: "UpdateDocumentDiscount",
  UPDATE_DOCUMENT_ITEM_PRICES: "UpdateDocumentItemPrices",
  UPDATE_DOCUMENT_DELIVERY_ITEM_PRICES: "UpdateDocumentDeliveryItemPrices"
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
    [DOCUMENT_TYPE.purchaseOrder]: Permissions.UPDATE_PURCHASE_ORDER_ITEM_PRICES,
  },
  [DocumentPermission.UPDATE_DOCUMENT_DELIVERY_ITEM_PRICES]: {
    [DOCUMENT_TYPE.quote]: Permissions.UPDATE_QUOTE_DELIVERY_ITEM_PRICES,
    [DOCUMENT_TYPE.order]: Permissions.UPDATE_ORDER_DELIVERY_ITEM_PRICES,
  },

};