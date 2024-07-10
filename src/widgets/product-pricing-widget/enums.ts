export enum UnitType {
    LENGTH = 1,
    CURRENCY,
    AREA,
    VOLUME,
    TIME,
    PERCENTAGE
}

export enum HtmlElementType {
    TEXT = 1,
    IMAGE,
    TEXT_AREA = 4,
}

export enum RuleType {
    OUTPUT,
    PARAMETER
}

export enum EWorkSource {
    INTERNAL,
    OUT,
    PARTIALLY,
}

export enum EOutsourceSupplierStatus {
    NeedApprove = 0,
    Approved,
    Manually
}

export enum EPricingViews {
    SELECTED_WORKFLOW,
    OTHERS_WORKFLOWS,
    OUTSOURCE_WORKFLOW
}
export enum ECalculationLogType{
    ERROR = 0,
    WARN = 1,
    SUCCESS ,
    MESSAGE
}