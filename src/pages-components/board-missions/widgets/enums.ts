export enum PStatus {
  IN_PROCESS = 2,
  DONE = 3,
}

export enum AStatus {
  OPEN = 0,
  PARTIAL_CLOSED = 1,
  CLOSED = 2,
  DRAFT = 3,
}

export enum ReceiptAccountingStatus {
  OPEN = 0,
  CANCELED = 1,
  CREATED = 2,
}

export enum BoardMissionStatusForFilter {
  WAITING = 1,
  URGENT,
  IN_PROCESS,
  STUCK,
  APPROVAL_REQUIRED,
  DONE,
  NotReady,
  NoStations
}
