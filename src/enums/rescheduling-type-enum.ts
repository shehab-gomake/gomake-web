export enum ReschedulingType {
  /**
   * Change employee or machine assignment for an action
   */
  ResourceChange = 1,

  /**
   * Move overdue actions to front of queue
   */
  OverdueRecovery = 2,

  /**
   * User manually changes start/end times
   */
  TimeSlotModification = 3,

  /**
   * Change action priority
   */
  PriorityChange = 4,
}
