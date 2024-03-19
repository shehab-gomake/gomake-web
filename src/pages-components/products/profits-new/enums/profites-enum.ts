export enum EPricingBy {
  COST = 1,
  QUANTITY = 2,
  MATERIAL_QUANTITY = 3,
  BEATS = 4,
  SQUARE_METER = 5,
  CUBIC_METER = 6,
  METER=8
}
export enum ETransition {
  LINEAR = 0,
  STEPS = 1,
}
export enum ETypeException {
  ADDITIONAL = 0,
  NEWBASE = 1,
  EDITBASE = 2,
  DEFAULT = 3,
}

export enum EProfitRowType {
  NORMAL_PROFIT_ROW = 1,
  EXCEPRION_PROFIT_ROW = 2,
}
export enum EStatementCategory {
  MACHINE = 1,
  MACHINECATEGORY = 2,
  CLIENTTYPE = 3,
  CLIENT = 4,
  PARAMETER = 5,
  OUTPUT = 6,
}

export enum EValueType {
  MACHINE = 1,
  MATERIAL = 2,
  INPUTNUMBER = 3,
  INPUTTEXT = 4,
  BOOLEAN = 5,
}
